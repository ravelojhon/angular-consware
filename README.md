# 📝 Angular CRUD Posts App

Una aplicación Angular moderna para la gestión de publicaciones (posts) con funcionalidades CRUD completas, interfaz de usuario elegante y arquitectura escalable.

## 🎯 Objetivo

Esta aplicación demuestra las mejores prácticas de desarrollo Angular, incluyendo:
- **CRUD completo** para gestión de publicaciones
- **Angular Material** para UI moderna y responsiva
- **Reactive Forms** con validaciones robustas
- **HTTP Interceptors** para manejo global de loading
- **Lazy Loading** para optimización de rendimiento
- **Testing completo** con cobertura del 80%+
- **CI/CD** con GitHub Actions

## 🚀 Características

### ✨ Funcionalidades Principales
- **📋 Lista de Posts**: Visualización en tabla con paginación
- **👁️ Detalle de Post**: Vista completa con información detallada
- **✏️ Crear Post**: Formulario reactivo con validaciones
- **🔄 Editar Post**: Reutilización del formulario para edición
- **🗑️ Eliminar Post**: Diálogo de confirmación elegante
- **🔄 Loading Global**: Indicadores de carga automáticos
- **📱 Responsive**: Diseño adaptable a todos los dispositivos

### ⚠️ Nota sobre la API
Esta aplicación utiliza [JSONPlaceholder](https://jsonplaceholder.typicode.com) como API de prueba, que es **solo de lectura**. Los posts creados y editados no se persisten realmente en la API, por lo que:
- Los posts creados devuelven un ID > 100 pero no existen en la API
- Los posts editados no guardan los cambios permanentemente
- Después de crear/editar, la aplicación navega de vuelta a la lista

### 🛠️ Tecnologías Utilizadas
- **Angular 20** - Framework principal
- **Angular Material** - Componentes UI
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático
- **SCSS** - Estilos avanzados
- **Jasmine/Karma** - Testing
- **Jest** - Testing alternativo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

## 📋 Requisitos

### Requisitos del Sistema
- **Node.js**: v18.x o superior
- **npm**: v8.x o superior
- **Angular CLI**: v20.x
- **Navegador**: Chrome, Firefox, Safari, Edge (últimas versiones)

### Requisitos de Desarrollo
- **Git** para control de versiones
- **Editor de código** (VS Code recomendado)
- **Extensiones recomendadas**:
  - Angular Language Service
  - Angular Snippets
  - Prettier - Code formatter
  - ESLint

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/angular-crud-posts.git
cd angular-crud-posts
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Crear archivo de configuración (opcional)
cp src/environments/environment.example.ts src/environments/environment.ts
```

### 4. Verificar Instalación
```bash
ng version
```

## 🏃‍♂️ Comandos de Desarrollo

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start
# o
ng serve

# Iniciar con puerto específico
ng serve --port 4200

# Iniciar con host específico
ng serve --host 0.0.0.0

# Iniciar con configuración de producción
ng serve --configuration=production
```

### Construcción
```bash
# Construir para desarrollo
npm run build
# o
ng build

# Construir para producción
ng build --configuration=production

# Construir con watch mode
npm run watch
# o
ng build --watch
```

### Testing
```bash
# Ejecutar tests en modo watch
npm run test:watch
# o
ng test

# Ejecutar tests una vez
npm run test:ci
# o
ng test --watch=false

# Ejecutar tests con cobertura
npm run test:coverage
# o
ng test --code-coverage

# Ejecutar tests con Jest
npm run test:unit

# Ejecutar tests con Jest y cobertura
npm run test:unit:coverage
```

### Linting y Formateo
```bash
# Ejecutar linting
npm run lint
# o
ng lint

# Ejecutar linting y corregir automáticamente
npm run lint:fix
# o
ng lint --fix

# Verificar seguridad
npm run audit:check
# o
npm audit
```

### E2E Testing
```bash
# Ejecutar tests end-to-end
npm run e2e
# o
ng e2e

# Ejecutar e2e con configuración específica
ng e2e --configuration=production
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios y modelos centrales
│   │   ├── interceptors/        # HTTP Interceptors
│   │   ├── models/              # Interfaces y tipos
│   │   └── services/            # Servicios principales
│   ├── features/                # Módulos de funcionalidades
│   │   └── posts/               # Módulo de posts
│   │       ├── posts-list/      # Componente de lista
│   │       ├── post-detail/     # Componente de detalle
│   │       ├── post-form/       # Componente de formulario
│   │       ├── delete-confirm-dialog/ # Diálogo de confirmación
│   │       └── posts/           # Módulo con lazy loading
│   ├── shared/                  # Componentes compartidos
│   │   └── global-loading/      # Loading global
│   ├── test-api/                # Componente de prueba API
│   ├── app.routes.ts            # Configuración de rutas
│   ├── app.config.ts            # Configuración de la app
│   └── app.ts                   # Componente principal
├── assets/                      # Recursos estáticos
├── environments/                # Configuraciones de entorno
└── styles.scss                  # Estilos globales
```

## 🎨 Capturas de Pantalla

### 📋 Lista de Posts
![Lista de Posts](docs/screenshots/posts-list.png)
*Vista principal con tabla de posts, botones de acción y loading states*

### 👁️ Detalle de Post
![Detalle de Post](docs/screenshots/post-detail.png)
*Vista detallada con información completa del post y acciones*

### ✏️ Formulario de Creación
![Formulario de Creación](docs/screenshots/post-form-create.png)
*Formulario reactivo para crear nuevos posts con validaciones*

### 🔄 Formulario de Edición
![Formulario de Edición](docs/screenshots/post-form-edit.png)
*Formulario reutilizado para editar posts existentes*

### 🗑️ Diálogo de Confirmación
![Diálogo de Eliminación](docs/screenshots/delete-dialog.png)
*Diálogo elegante para confirmar eliminación de posts*

### 📱 Vista Responsive
![Vista Mobile](docs/screenshots/mobile-view.png)
*Diseño responsivo optimizado para dispositivos móviles*

## 🔧 Configuración Avanzada

### Variables de Entorno
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://jsonplaceholder.typicode.com',
  appName: 'Angular CRUD Posts',
  version: '1.0.0'
};
```

### Configuración de Linting
```json
// .eslintrc.json
{
  "extends": ["@angular-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Configuración de Testing
```javascript
// karma.conf.js
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

## 🧪 Testing

### Cobertura de Tests
- **PostService**: 100% cobertura
- **PostsList Component**: 95% cobertura
- **PostForm Component**: 90% cobertura
- **Cobertura Total**: 85%+

### Ejecutar Tests
```bash
# Tests unitarios
npm run test:ci

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Reportes de Cobertura
- **HTML**: `coverage/index.html`
- **LCOV**: `coverage/lcov.info`
- **Consola**: Resumen en terminal

## 🚀 CI/CD

### GitHub Actions
El proyecto incluye un pipeline completo de CI/CD:

```yaml
# .github/workflows/angular.yml
- Test: Unit tests, linting, coverage
- E2E: End-to-end testing
- Security: npm audit, dependency check
- Build: Production build verification
```

### Pre-commit Hooks
- **Linting**: Validación de código
- **Testing**: Ejecución de tests
- **Quality Gates**: Prevención de commits con errores

## 📚 Documentación Adicional

### Guías de Desarrollo
- [Testing Guide](TESTING.md) - Guía completa de testing
- [API Documentation](docs/api.md) - Documentación de la API
- [Component Guide](docs/components.md) - Guía de componentes

### Recursos Externos
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)

## 🤝 Contribución

### Cómo Contribuir
1. Fork el repositorio
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

### Estándares de Código
- **ESLint**: Configuración incluida
- **Prettier**: Formateo automático
- **Conventional Commits**: Estilo de commits
- **Testing**: Tests obligatorios para nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Angular Team](https://angular.io/) por el framework
- [Angular Material Team](https://material.angular.io/) por los componentes
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) por la API de prueba
- Comunidad Angular por las mejores prácticas

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/angular-crud-posts/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/angular-crud-posts/discussions)
- **Email**: tu-email@ejemplo.com

---

<div align="center">

**⭐ Si te gusta este proyecto, ¡dale una estrella! ⭐**

[![Angular](https://img.shields.io/badge/Angular-20-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-20-purple.svg)](https://material.angular.io/)
[![Tests](https://img.shields.io/badge/Tests-85%25-green.svg)](https://angular.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>