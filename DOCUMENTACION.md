# Documentación de Customizaciones - Tema Lareferencia

## Archivos Modificados

### 📄 HTML Templates

#### Header
- **`src/themes/lareferencia/app/header/header.component.html`**
  - Simplificación de estructura y clases Bootstrap
- **`src/themes/lareferencia/app/header/header.component.scss`**
  - Borde inferior cambiado a 6px turquesa (`#04bab8`)

#### Home Page
- **`src/themes/lareferencia/app/home-page/home-news/home-news.component.html`**
  - Barra de búsqueda prominente (60% width)
  - Cards laterales modernizadas (40% width) con enlaces institucionales

#### Item Pages (Publicaciones)
- **`src/themes/lareferencia/app/item-page/simple/item-types/publication/publication.component.html`**
  - Widget de estadísticas `<lib-lareferencia-widget-embed [widgetType]="'lrw'">`
  - Botón de citación `<ds-item-page-bibliography>` (APA, MLA, BibTeX, etc.)

- **`src/themes/lareferencia/app/item-page/simple/item-types/untyped-item/untyped-item.component.html`**
  - Widget de estadísticas y botón de citación agregados

- **`src/themes/lareferencia/app/item-page/media-viewer/media-viewer-pdf/`**
  - Nuevo componente para visualización de PDFs usando Blob URLs para mayor seguridad y persistencia.
  - Soporte para múltiples archivos PDF con selector dinámico.

#### Resultados de Búsqueda
- **`src/themes/lareferencia/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.html`**
  - Template customizado para resultados de búsqueda de ítems.
- **`src/themes/lareferencia/app/shared/object-list/sidebar-search-list-element/item-types/publication/publication-sidebar-search-list-element.component.html`**
  - Template para sidebar de búsqueda.

### 🎨 CSS/SCSS

#### Componentes de UI
- **`src/themes/lareferencia/app/home-page/home-news/home-news.component.scss`**
  - `.search-form-wrapper`: Efecto glassmorphism y estilos modernizados para la búsqueda.
  - Colores de marca dinámicos: `#4a90e2`, `#a370f7`, `#27ae60`, `#eb5757`.
- **`src/themes/lareferencia/app/header/header.component.scss`**
  - `border-bottom: 6px solid #04bab8 !important;`.
- **`src/themes/lareferencia/app/item-page/simple/field-components/specific-field/bibliography/`**
  - Estilos del modal de citas y botones de copiado.

#### Branding y Variables
- **`src/themes/lareferencia/styles/_theme_sass_variable_overrides.scss`**
  - Colores institucionales: Primary (`#3a5180`), Secondary (`#04799c`).
- **`src/themes/lareferencia/styles/_custom_variables.scss`**
  - `--ds-footer-bg: #3a5180`
  - `--ds-breadcrumb-bg: #04bab7`

### 🔧 TypeScript Components

- **`src/themes/lareferencia/app/item-page/simple/item-types/publication/publication.component.ts`**
  - Integración de widgets y componente de bibliografía.
- **`src/themes/lareferencia/app/item-page/media-viewer/media-viewer.component.ts`**
  - Lógica para detección automática de bitstreams PDF en el visor.
- **`src/themes/lareferencia/app/item-page/simple/field-components/specific-field/bibliography/`**
  - `ItemPageBibliographyComponent`: Registro dinámico de i18n y manejo de citas.
  - `ItemBibliographyService`: Servicio local al tema para consumo de API `/bibliography`.

### ⚙️ Configuración y Assets

- **`src/index.html`** y **`config/config.dev.yml`**
  - Título institucional y favicons configurados.
- **`src/assets/i18n/`**
  - Traducciones del botón de citar manejadas programáticamente para aislamiento total del tema.

---

## Resumen de Cambios

1. ✅ **Widget de Estadísticas**: Integrado en todas las páginas de ítems.
2. ✅ **Visor de PDF Moderno**: SOP con Blob URLs y soporte para múltiples archivos.
3. ✅ **Citas Bibliográficas**: Modal con formatos APA, BibTeX, etc., disponible en ítems.
4. ✅ **Home Page Rediseñada**: Búsqueda prominente y estética glassmorphism.
5. ✅ **Header & Branding**: Colores institucionales aplicados consistentemente.
6. ✅ **Zero Core Changes**: Todas las funcionalidades operan exclusivamente desde el tema lareferencia.
