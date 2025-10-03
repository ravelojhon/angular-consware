# 📸 Capturas de Pantalla

Este directorio contiene las capturas de pantalla de la aplicación Angular CRUD Posts.

## 📋 Lista de Posts

- **Archivo**: `posts-list.png`
- **Descripción**: Vista principal con tabla de posts, botones de acción y loading states
- **Características**:
  - Tabla responsiva con Angular Material
  - Botones de acción (Ver, Editar, Eliminar)
  - Loading spinner durante carga
  - Botón de crear nuevo post

## 👁️ Detalle de Post

- **Archivo**: `post-detail.png`
- **Descripción**: Vista detallada con información completa del post
- **Características**:
  - Información completa del post
  - Chips con ID y Usuario
  - Botones de acción (Editar, Eliminar, Volver)
  - Diseño de card elegante

## ✏️ Formulario de Creación

- **Archivo**: `post-form-create.png`
- **Descripción**: Formulario reactivo para crear nuevos posts
- **Características**:
  - Campos con validaciones
  - Mensajes de error dinámicos
  - Botones de acción (Crear, Limpiar, Cancelar)
  - Loading states

## 🔄 Formulario de Edición

- **Archivo**: `post-form-edit.png`
- **Descripción**: Formulario reutilizado para editar posts existentes
- **Características**:
  - Precarga de datos existentes
  - Título dinámico (Crear/Editar)
  - Mismas validaciones que creación
  - Botón de actualización

## 🗑️ Diálogo de Confirmación

- **Archivo**: `delete-dialog.png`
- **Descripción**: Diálogo elegante para confirmar eliminación
- **Características**:
  - Preview del post a eliminar
  - Botones de confirmación
  - Diseño de advertencia
  - Responsive design

## 📱 Vista Responsive

- **Archivo**: `mobile-view.png`
- **Descripción**: Diseño responsivo optimizado para móviles
- **Características**:
  - Layout adaptado a pantallas pequeñas
  - Navegación optimizada
  - Botones táctiles
  - Texto legible

## 🎨 Loading States

- **Archivo**: `loading-states.png`
- **Descripción**: Diferentes estados de carga de la aplicación
- **Características**:
  - Loading global con overlay
  - Loading local en componentes
  - Spinners de Angular Material
  - Mensajes de estado

## 📊 Cobertura de Tests

- **Archivo**: `test-coverage.png`
- **Descripción**: Reporte de cobertura de tests
- **Características**:
  - Cobertura por archivo
  - Métricas de cobertura
  - Reporte HTML interactivo
  - Umbrales de calidad

## 🚀 GitHub Actions

- **Archivo**: `github-actions.png`
- **Descripción**: Pipeline de CI/CD en GitHub Actions
- **Características**:
  - Jobs de testing
  - Jobs de linting
  - Jobs de build
  - Jobs de seguridad

## 📝 Notas Técnicas

### Resolución Recomendada

- **Desktop**: 1920x1080 o superior
- **Tablet**: 1024x768
- **Mobile**: 375x667 (iPhone SE)

### Formato de Imágenes

- **Formato**: PNG
- **Calidad**: Alta resolución
- **Tamaño**: Optimizado para web
- **Compresión**: Sin pérdida de calidad

### Captura de Pantalla

Para capturar pantallas de la aplicación:

1. **Iniciar la aplicación**:

   ```bash
   npm start
   ```

2. **Navegar a las diferentes vistas**:

   - Lista: `http://localhost:4200`
   - Detalle: `http://localhost:4200/posts/1`
   - Crear: `http://localhost:4200/posts/new`
   - Editar: `http://localhost:4200/posts/1/edit`

3. **Capturar pantallas**:

   - Usar herramientas de captura del navegador
   - Asegurar que se vean todos los elementos
   - Capturar en diferentes resoluciones

4. **Optimizar imágenes**:
   - Redimensionar si es necesario
   - Comprimir para web
   - Mantener calidad visual
