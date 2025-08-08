# CV & Portfolio — Plantilla para GitHub Pages (Matías Aguetti)

## Archivos incluidos
- `index.html` — página principal (presentación, servicios y carrusel resumido).
- `portfolio.html` — portfolio completo con fichas de proyecto.
- `assets/style.css` — hoja de estilos (paleta neutra: negro/gris, responsive y animaciones on-scroll).
- `assets/script.js` — script (i18n ES/EN/PT, carrusel, animaciones, año dinámico).
- `assets/nomlogo.jpg` — thumbnail para Nomlogo (subir tú la imagen).
- `assets/clubdeinversores.jpg` — thumbnail para Club de Inversores.
- `assets/villas-zamna.jpg` — thumbnail para Villas Zamná.
- `assets/logo-favicon.svg` — logotipo / favicon (subir tú el archivo).

## Nombres de archivos de imágenes (sube exactamente así)
- `assets/nomlogo.jpg` (recomendado 1600×1067, JPG, calidad 80)
- `assets/clubdeinversores.jpg` (1600×1067)
- `assets/villas-zamna.jpg` (1600×1067)
- `assets/logo-favicon.svg` (vector preferible, o `logo-favicon.png` si no tienes SVG)

## Cómo desplegar paso a paso en GitHub Pages
1. **Crear el repositorio:** En GitHub crea un repositorio público, por ejemplo `matias-portfolio`.
2. **Subir archivos:** Clona el repo localmente y copia los archivos (`index.html`, `portfolio.html`, carpeta `assets/`). Ejemplo:
```bash
git clone git@github.com:TU_USUARIO/matias-portfolio.git
cd matias-portfolio
# copia los archivos al directorio del repo
git add .
git commit -m "Plantilla inicial: CV & portfolio"
git push origin main
