// scripts/generate-sitemap.js
// Usage: node scripts/generate-sitemap.js [publishDir] [baseUrl]
// Example: node scripts/generate-sitemap.js ./ public https://matiasaguetti.github.io/portfoliocv

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publishDir = process.argv[2] || './';          // directorio a escanear (build output)
let baseUrl = process.argv[3] || process.env.SITE_BASE_URL || ''; // ej. https://matiasaguetti.github.io/portfoliocv

if (!baseUrl) {
  console.error('ERROR: baseUrl missing. Provide as 2nd arg or env SITE_BASE_URL');
  process.exit(1);
}

// Extensiones / exclusiones
const includeExt = ['.html'];
const excludePaths = ['assets/', 'scripts/', 'node_modules/'];

function shouldExclude(p) {
  return excludePaths.some(ex => p.startsWith(ex));
}

// Obtener lista recursiva de archivos
function walk(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const rel = path.join(dir, it.name);
    if (shouldExclude(rel)) continue;
    if (it.isDirectory()) {
      files = files.concat(walk(rel));
    } else if (includeExt.includes(path.extname(it.name).toLowerCase())) {
      files.push(rel);
    }
  }
  return files;
}

// obtener lastmod via git (ISO 8601)
function getLastMod(filePath) {
  try {
    // si no es repo git o el archivo no está trackeado, devuelve null
    const out = execSync(`git log -1 --format=%cI -- "${filePath.replace(/"/g,'\\"')}"`, { stdio: ['pipe','pipe','ignore'] })
      .toString().trim();
    return out || null;
  } catch (e) {
    return null;
  }
}

function toUrl(relPath) {
  // Normalize windows paths
  let p = relPath.replace(/\\/g, '/');
  // Remove leading ./ if present
  if (p.startsWith('./')) p = p.slice(2);
  // If filename is index.html -> map to directory root (pretty URL)
  if (p.endsWith('/index.html')) {
    p = p.replace(/\/index\.html$/, '/');
  } else if (p.endsWith('index.html')) {
    p = p.replace(/index\.html$/, '');
  }
  // Ensure leading slash
  if (!p.startsWith('/')) p = '/' + p;
  return baseUrl.replace(/\/$/, '') + p;
}

// detect language variants for a base file name (e.g. page.html, page.en.html)
function detectLangVariants(allFiles, file) {
  // variants pattern: filename.lang.html or filename.lang/index.html not considered here
  const dir = path.dirname(file);
  const name = path.basename(file);
  const variants = allFiles.filter(f => {
    const b = path.basename(f);
    // exact match or with .lang before .html
    if (b === name) return true;
    const m = b.match(/^(.+)\.([a-z]{2})\.html$/i);
    if (m) {
      const base = m[1] + '.html';
      return base === name;
    }
    return false;
  });
  return variants;
}

function buildUrlEntry(file, allFiles) {
  const url = toUrl(file);
  const lastmod = getLastMod(file);
  // default values
  const changefreq = 'monthly';
  const priority = file.includes('index.html') ? '1.0' : '0.6';

  // detect hreflang alternatives
  const variants = detectLangVariants(allFiles, file);
  const xhtmlLinks = [];
  for (const v of variants) {
    // determine language code: e.g. page.en.html -> en
    const b = path.basename(v);
    const m = b.match(/^(.+)\.([a-z]{2})\.html$/i);
    let lang = null;
    if (m) lang = m[2].toLowerCase();
    else {
      // fallback to site default
      lang = null;
    }
    if (lang) {
      xhtmlLinks.push({ lang, href: toUrl(v) });
    }
  }

  return { url, lastmod, changefreq, priority, xhtmlLinks };
}

// Main
(function main(){
  const files = walk(publishDir);
  // Filter out duplicates and sort
  const uniq = Array.from(new Set(files)).sort();

  const entries = uniq.map(f => buildUrlEntry(f, uniq));

  // build XML
  const lines = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`);
  lines.push(`        xmlns:xhtml="http://www.w3.org/1999/xhtml">`);

  for (const e of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(e.url)}</loc>`);
    if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    if (e.changefreq) lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
    if (e.priority) lines.push(`    <priority>${e.priority}</priority>`);
    for (const x of e.xhtmlLinks) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${x.lang}" href="${escapeXml(x.href)}" />`);
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');

  const out = lines.join('\n');
  const outPath = path.join(publishDir, 'sitemap.xml');
  fs.writeFileSync(outPath, out, { encoding: 'utf8' });
  console.log('Sitemap generado en', outPath, 'con', entries.length, 'URLs');
})();

function escapeXml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
