# Documentación de Customizaciones - Tema Lareferencia

## Archivos Modificados

### 📄 HTML Templates

#### Home Page
- **`src/themes/lareferencia/app/home-page/home-news/home-news.component.html`**
  - Barra de búsqueda ampliada (columna 60%)
  - Cards laterales reducidas (columna 40%)
  - Primera card enlaza a: `https://dspace-prd.lareferencia.info/handle/123456789/1`

#### Item Pages (Publicaciones)
- **`src/themes/lareferencia/app/item-page/simple/item-types/publication/publication.component.html`**
  - Widget de estadísticas `<lib-lareferencia-widget-embed [widgetType]="'lrw'">` agregado

- **`src/themes/lareferencia/app/item-page/simple/item-types/untyped-item/untyped-item.component.html`**
  - Widget de estadísticas agregado (igual que publication)

#### Resultados de Búsqueda
- **`src/themes/lareferencia/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.html`**
  - Template customizado copiado del core

- **`src/themes/lareferencia/app/shared/object-list/sidebar-search-list-element/item-types/publication/publication-sidebar-search-list-element.component.html`**
  - Template para sidebar de búsqueda

### 🎨 CSS/SCSS

#### Estilos de Componentes
- **`src/themes/lareferencia/app/home-page/home-news/home-news.component.scss`**
  - `.search-form-wrapper`: Efecto glassmorphism en barra de búsqueda
  - Input de búsqueda: altura 60px, font-size 1.2rem
  - Cards: iconos reducidos a 45px, padding reducido
  - Colores de marca modernizados: `#4a90e2`, `#a370f7`, `#27ae60`, `#eb5757`

#### Variables de Tema y Colores de Marca
- **`src/themes/lareferencia/styles/_theme_sass_variable_overrides.scss`**
  - **Colores principales de LA Referencia:**
    - `$lr-primary: #3a5180` (Azul institucional)
    - `$lr-secondary: #04799c` (Azul/turquesa secundario)
  - **Variables Bootstrap sobrescritas:**
    - `$primary: #3a5180`
    - `$secondary: #04799c`

- **`src/themes/lareferencia/styles/_custom_variables.scss`**
  - `--ds-footer-bg: #{$primary}` - Footer con color primary (#3a5180)
  - `--ds-breadcrumb-bg: #04bab7` - Breadcrumb turquesa
  - Header y navbar configurados con colores del tema

#### Colores Modernos en Home News Component
- **Brand 1 (Proyectos):** `#4a90e2` - Azul moderno
- **Brand 2 (Temas):** `#a370f7` - Púrpura moderno
- **Brand 3 (Documentación):** `#27ae60` - Verde moderno
- **Brand 4 (Dashboard):** `#eb5757` - Rojo moderno

### 🔧 TypeScript Components

- **`src/themes/lareferencia/app/item-page/simple/item-types/publication/publication.component.ts`**
  - Import de `lareferenciaWidgetEmbedModule`
  - Configurado como standalone component

- **`src/themes/lareferencia/app/item-page/simple/item-types/untyped-item/untyped-item.component.ts`**
  - Mismas modificaciones que publication

- **`src/themes/lareferencia/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.ts`**
  - Template y styles localizados al tema

- **`src/themes/lareferencia/app/shared/object-list/sidebar-search-list-element/item-types/publication/publication-sidebar-search-list-element.component.ts`**
  - Template localizado

### ⚙️ Configuración

- **`src/index.html`**
  - Título: `<title>LA Referencia - Lyrasis</title>`

- **`config/config.dev.yml`**
  - Favicons apuntando a `assets/lareferencia/favicons/`

- **`src/themes/lareferencia/assets/data/widget.config.json`**
  - Configuración de widgets lrw y lrhw

- **`src/themes/lareferencia/assets/favicons/manifest.webmanifest`**
  - Web manifest con nombre y colores del tema

### 📦 Dependencias

- **`package.json`**
  - `lareferencia-widget-embed: ^1.1.5`

---

## Resumen de Cambios

1. ✅ Widget de estadísticas integrado en páginas de ítems
2. ✅ Home page rediseñada con barra de búsqueda prominente
3. ✅ Cards laterales reducidas y modernizadas
4. ✅ Favicon y título configurados para LA Referencia - Lyrasis
5. ✅ Templates de búsqueda customizados

**Documentación completa:** [`TUTORIAL.MD`](file:///home/juan-manitta/Escritorio/Trabajo/LA_Referencia/Lyrasis/dspace-angular/TUTORIAL.MD)
