# Aureum Digital Studio — Web

Web profesional multipágina, optimizada para SEO y conversión, construida con HTML/CSS/JS puro (sin dependencias). Lista para subir a cualquier hosting.

## Estructura
- `index.html` — Inicio (embudo completo: hero → prueba social → servicios → por qué → experto redes → proceso → testimonios → CTA)
- `servicios.html` — Índice de servicios (tarjetas clicables + comparativa)
- `servicio-web.html` / `servicio-seo.html` / `servicio-redes.html` / `servicio-crm-ia.html` — Fichas de cada servicio con extras y FAQ
- `nosotros.html` — Autoridad, equipo y método
- `contacto.html` — Formulario de captación de leads
- `css/styles.css` — Sistema de diseño (paleta Aureum 60/30/10)
- `js/main.js` — Animaciones, menú móvil, contador y envío del formulario
- `sitemap.xml` / `robots.txt` — SEO técnico

## ⚙️ Cosas que DEBES personalizar antes de publicar

1. **Formulario de leads (IMPORTANTE).**
   Usa [FormSubmit](https://formsubmit.co) (gratis, sin registro). El destino ya está puesto a `pablomolinaoliver@gmail.com` en `contacto.html`.
   - La **primera vez** que alguien envíe el formulario, FormSubmit te enviará un email de **activación**: haz clic en el enlace para confirmar. A partir de ahí, todos los leads llegan a tu Gmail.
   - Para evitar spam, puedes sustituir tu email por el **token aleatorio** que te da FormSubmit en ese primer correo (en `action="https://formsubmit.co/TU_TOKEN"`).

2. **Número de WhatsApp.** Busca y reemplaza `34600000000` por tu número real (con prefijo, sin `+` ni espacios) en todos los archivos.

3. **Email de contacto mostrado.** Reemplaza `hola@aureumdigital.studio` por tu email real si es distinto.

4. **Dominio.** Cuando tengas dominio, reemplaza `https://aureumdigital.studio/` en los `<link canonical>`, Open Graph, `sitemap.xml` y `robots.txt`.

5. **Imágenes.** Ahora usan fotos reales de Unsplash (con respaldo a color de marca si no cargan). Para máxima coherencia, sustitúyelas por fotos propias o generadas con IA en `assets/` y actualiza las rutas `src`.

6. **Experto en redes.** Está como genérico ("nuestro especialista") con las cifras (+60k / +10M). Si quieres, añade nombre, @ y foto real en `servicio-redes.html` y `nosotros.html`.

## Publicar (gratis y fácil)
- Arrastra la carpeta a [Netlify Drop](https://app.netlify.com/drop) o a Vercel, o súbela por FTP a tu hosting. Es 100% estática.

## SEO incluido
Meta títulos/descripciones únicos, canonical, Open Graph, datos estructurados (JSON-LD: ProfessionalService, Service, BreadcrumbList), HTML semántico, sitemap y robots.
