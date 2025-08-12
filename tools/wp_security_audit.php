<?php
/**
 * wp_security_audit.php
 * Lightweight WordPress security diagnostic script.
 *
 * USAGE (recommended):
 * 1) Upload to server outside public webroot or to tools/ folder.
 * 2) Run via SSH: php tools/wp_security_audit.php
 * 3) Open tools/security-report.html or download tools/security-report.json
 *
 * WARNING: remove this file after use or protect its access.
 */

// ----------------- CONFIG -----------------
$BASE_PATH = realpath(__DIR__ . '/..'); // root of repo; change if executing from root, or set to '/var/www/html'
$INCLUDE_DIRS = ['wp-content', 'wp-includes', 'wp-admin']; // directories to scan (relative to $BASE_PATH)
$EXCLUDE_PATHS = ['wp-content/uploads/cache', 'wp-content/cache', '.git', 'node_modules']; // partial matches
$RECENT_DAYS = 30; // threshold to flag recently modified files
$SUSPICIOUS_PATTERNS = [
    // PHP suspicious constructs
    '/eval\s*\(\s*base64_decode\s*\(/i',
    '/gzinflate\s*\(/i',
    '/preg_replace\s*\(\s*.*,\s*.*,\s*.*,\s*e\s*\)/i', // deprecated /e usage
    '/create_function\s*\(/i',
    '/shell_exec\s*\(/i',
    '/system\s*\(/i',
    '/passthru\s*\(/i',
    '/exec\s*\(/i',
    '/`[^`]+`/i', // backticks exec
    '/base64_decode\s*\(/i',
    // suspicious remote inclusion / fetch
    '/file_get_contents\s*\(\s*[\'"]https?:\/\//i',
    '/curl_exec\s*\(/i',
    '/fopen\s*\(\s*[\'"]https?:\/\//i',
    // JS suspicious constructs (for .js files)
    '/window\.location\.href\s*=/i',
    '/location\.href\s*=/i',
    '/document\.write\s*\(/i',
    '/unescape\s*\(/i',
    '/fromCharCode\s*\(/i',
];
$HASH_ALGO = 'sha256';
$OUTPUT_DIR = __DIR__; // tools/
$REPORT_JSON = $OUTPUT_DIR . '/security-report.json';
$REPORT_HTML = $OUTPUT_DIR . '/security-report.html';
$BASELINE_FILE = $OUTPUT_DIR . '/baseline-hashes.json'; // optional baseline for comparison
$MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // skip files > 5MB for content scanning (still hash them)

// ----------------- HELPERS -----------------
function isExcluded($path, $excludes) {
    foreach ($excludes as $ex) {
        if (stripos($path, $ex) !== false) return true;
    }
    return false;
}

function listFiles($root, $includeDirs, $excludes) {
    $results = [];
    foreach ($includeDirs as $d) {
        $path = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $d;
        if (!is_dir($path)) continue;
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));
        foreach ($it as $f) {
            $filePath = $f->getPathname();
            if (isExcluded($filePath, $excludes)) continue;
            if ($f->isFile()) $results[] = $filePath;
        }
    }
    return $results;
}

function humanFilesize($bytes) {
    $units = ['B','KB','MB','GB','TB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units)-1) { $bytes /= 1024; $i++; }
    return round($bytes,2) . ' ' . $units[$i];
}

// ----------------- MAIN SCAN -----------------
echo "WP Security Audit — starting scan...\n";
$files = listFiles($BASE_PATH, $INCLUDE_DIRS, $EXCLUDE_PATHS);
echo "Files found to scan: " . count($files) . "\n";

$now = time();
$recentThreshold = $now - ($RECENT_DAYS * 24 * 60 * 60);
$report = [
    'meta' => [
        'scanned_at' => date('c'),
        'base_path' => $BASE_PATH,
        'include_dirs' => $INCLUDE_DIRS,
        'exclude_paths' => $EXCLUDE_PATHS,
        'suspicious_patterns_count' => count($SUSPICIOUS_PATTERNS),
    ],
    'summary' => [
        'total_files' => 0,
        'recent_files' => 0,
        'suspicious_files' => 0,
        'mu_plugins' => 0,
    ],
    'files' => [],
];

foreach ($files as $file) {
    $rel = substr($file, strlen($BASE_PATH)+1);
    $info = [
        'path' => $rel,
        'size' => filesize($file),
        'size_human' => humanFilesize(filesize($file)),
        'mtime' => date('c', filemtime($file)),
        'is_recent' => filemtime($file) >= $recentThreshold,
        'hash' => hash_file($GLOBALS['HASH_ALGO'], $file),
        'suspicious_matches' => [],
    ];

    $report['summary']['total_files']++;

    if ($info['is_recent']) $report['summary']['recent_files']++;

    // Flag mu-plugins presence
    if (stripos($rel, 'wp-content' . DIRECTORY_SEPARATOR . 'mu-plugins') !== false) {
        $report['summary']['mu_plugins']++;
    }

    // Scan content for suspicious patterns if not too large and is text
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $textLike = in_array($ext, ['php','js','html','htm','inc','txt','css','json','xml']);
    if ($textLike && $info['size'] <= $MAX_FILE_SIZE_BYTES) {
        $content = @file_get_contents($file);
        if ($content !== false) {
            foreach ($GLOBALS['SUSPICIOUS_PATTERNS'] as $pat) {
                if (preg_match($pat, $content)) {
                    $info['suspicious_matches'][] = $pat;
                }
            }
            // detect remote script domains (simple heuristic)
            if (preg_match_all('/https?:\/\/[^\s\'"]+/i', $content, $m)) {
                foreach (array_unique($m[0]) as $url) {
                    // flag external domains not on allowlist (allowlist small)
                    if (stripos($url, $_SERVER['HTTP_HOST'] ?? '') === false &&
                        stripos($url, 'cdnjs.cloudflare.com') === false &&
                        stripos($url, 'fonts.googleapis.com') === false &&
                        stripos($url, 'google-analytics.com') === false) {
                        $info['external_urls'][] = $url;
                    }
                }
            }
        }
    }

    if (!empty($info['suspicious_matches']) || !empty($info['external_urls'])) $report['summary']['suspicious_files']++;

    $report['files'][] = $info;
}

// ----------------- Optional baseline compare -----------------
if (file_exists($BASELINE_FILE)) {
    echo "Baseline file found: comparing hashes...\n";
    $baseline = json_decode(file_get_contents($BASELINE_FILE), true);
    $report['baseline'] = ['loaded' => true, 'changed' => []];
    $baselineHashes = is_array($baseline) ? $baseline : [];
    foreach ($report['files'] as $f) {
        $p = $f['path'];
        $h = $f['hash'];
        if (isset($baselineHashes[$p])) {
            if ($baselineHashes[$p] !== $h) {
                $report['baseline']['changed'][] = $p;
            }
        } else {
            $report['baseline']['new'][] = $p;
        }
    }
} else {
    $report['baseline'] = ['loaded' => false];
}

// ----------------- Write JSON report -----------------
file_put_contents($REPORT_JSON, json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo "JSON report written to: $REPORT_JSON\n";

// ----------------- Write simple HTML report -----------------
$html = "<!doctype html><html><head><meta charset='utf-8'><title>Security report</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#0b0b0b;color:#eaeaea;padding:20px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid rgba(255,255,255,0.04)}.susp{background:#3a0b0b} .recent{background:#2b2b12}</style></head><body>";
$html .= "<h1>Security report</h1>";
$html .= "<p>Scanned at: " . htmlspecialchars($report['meta']['scanned_at']) . "</p>";
$html .= "<h2>Summary</h2><ul>";
foreach ($report['summary'] as $k=>$v) $html .= "<li><strong>$k:</strong> $v</li>";
$html .= "</ul>";

$html .= "<h2>Suspicious / flagged files</h2>";
$html .= "<table><thead><tr><th>Path</th><th>Size</th><th>Modified</th><th>Suspicious matches</th><th>External URLs</th></tr></thead><tbody>";
foreach ($report['files'] as $f) {
    if (empty($f['suspicious_matches']) && empty($f['external_urls']) && !$f['is_recent']) continue;
    $cls = $f['is_recent'] ? 'recent' : '';
    $matches = isset($f['suspicious_matches']) ? implode(', ', array_map('htmlspecialchars',$f['suspicious_matches'])) : '';
    $exturls = isset($f['external_urls']) ? implode('<br>', array_map('htmlspecialchars',$f['external_urls'])) : '';
    $html .= "<tr class='$cls'><td><code>" . htmlspecialchars($f['path']) . "</code></td><td>" . htmlspecialchars($f['size_human']) . "</td><td>" . htmlspecialchars($f['mtime']) . "</td><td>$matches</td><td>$exturls</td></tr>";
}
$html .= "</tbody></table>";

if ($report['baseline']['loaded']) {
    $html .= "<h2>Baseline changes</h2>";
    $changed = $report['baseline']['changed'] ?? [];
    $new = $report['baseline']['new'] ?? [];
    $html .= "<p>Changed files: " . count($changed) . "</p>";
    $html .= "<ul>" . implode('', array_map(function($p){ return "<li><code>".htmlspecialchars($p)."</code></li>"; }, $changed ?: [])) . "</ul>";
    $html .= "<p>New files: " . count($new) . "</p>";
    $html .= "<ul>" . implode('', array_map(function($p){ return "<li><code>".htmlspecialchars($p)."</code></li>"; }, $new ?: [])) . "</ul>";
}

$html .= "<hr><p>Report generated by wp_security_audit.php — remove script from server when finished.</p>";
$html .= "</body></html>";
file_put_contents($REPORT_HTML, $html);
echo "HTML report written to: $REPORT_HTML\n";

echo "DONE\n";
