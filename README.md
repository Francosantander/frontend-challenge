# Frontend Challenge - Buscador de Productos

## 📋 Descripción del Desafío

Este proyecto es un desafío práctico de frontend que consiste en crear una aplicación web de búsqueda de productos inspirada en **MercadoLibre**. El objetivo es demostrar habilidades en desarrollo frontend moderno, integrando buenas prácticas de UX/UI, manejo de estado, y consumo de APIs.

### Funcionalidades Principales

El desafío se compone de tres partes fundamentales:

1. **🔍 Buscador**: Implementar una barra de búsqueda funcional que permita buscar productos
2. **📋 Lista de Resultados**: Mostrar los resultados de búsqueda en una interfaz clara y organizada
3. **📄 Detalle del Producto**: Crear una vista detallada para cada producto seleccionado

## 🎯 Requisitos Básicos

### Funcionales
- [x] Barra de búsqueda con autocompletado
- [ ] Página de resultados con lista de productos
- [ ] Vista de detalle individual de producto
- [ ] Navegación entre vistas
- [~] Responsive design (móvil, tablet, desktop)

### Técnicos
- ⚛️ **Framework**: Next.js 15+ con App Router
- 🎨 **Estilos**: CSS/SCSS Modules o Styled Components
- 🔧 **Estado**: React Hooks (useState, useEffect, etc.)
- 🌐 **API**: Mock Web Server
- ♿ **Accesibilidad**: Implementar buenas prácticas de ARIA y navegación por teclado
- 📱 **Responsive**: Mobile-first design

## 🚀 Instalación y Setup

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPO]
   cd frontend-challenge
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno (opcional)**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus configuraciones
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

```bash
npm run dev        # Modo desarrollo
npm run build      # Build de producción
npm run start      # Ejecutar build de producción
```

## 🏗️ Estructura del Proyecto

```
frontend-challenge/
├── src/
│   ├── app/                     # App Router (Next.js 15+)
│   │   ├── layout.js            # Layout principal
│   │   ├── page.js              # Página home
│   │   ├── globals.css          # Estilos globales CSS
│   │   ├── page.module.css      # Estilos de página
│   │   └── favicon.ico          # Icono del sitio
│   ├── components/              # Componentes reutilizables
│   │   ├── layout/              # Componentes de layout
│   │   │   ├── MSWProvider.js   # Provider de Mock Service Worker
│   │   │   └── Topbar/          # Componente Topbar
│   │   │       ├── Topbar.js
│   │   │       └── Topbar.module.scss
│   │   └── search/              # Componentes de búsqueda
│   │       └── SearchBox/       # Caja de búsqueda
│   │           ├── SearchBox.js
│   │           └── SearchBox.module.scss
│   ├── mocks/                   # Mock Service Worker
│   │   ├── handlers.js          # Handlers de API mock
│   │   ├── browser.js           # Configuración MSW browser
│   │   ├── server.js            # Configuración MSW server
│   │   └── data.js              # Datos mock
│   ├── styles/                  # Estilos globales
│   │   └── globals.scss         # Variables y estilos SCSS
│   └── __tests__/               # Tests
│       └── msw-api.test.js      # Tests de Mock API
├── public/                      # Archivos estáticos
│   ├── mockServiceWorker.js     # Service Worker de MSW
│   ├── next.svg                 # Logo de Next.js
│   ├── vercel.svg              # Logo de Vercel
│   ├── file.svg                # Iconos SVG
│   ├── globe.svg
│   └── window.svg
├── jest.config.js               # Configuración de Jest
├── jest.setup.js                # Setup de Jest
├── setupTests.js                # Setup adicional de tests
├── jsconfig.json                # Configuración de JavaScript
├── next.config.mjs              # Configuración de Next.js
├── eslint.config.mjs            # Configuración de ESLint
├── package.json                 # Dependencias y scripts
├── package-lock.json            # Lock de dependencias
├── .gitignore                   # Archivos ignorados por git
└── README.md                    # Este archivo
```

## 🛠️ Stack Tecnológico

### Principales Dependencias
- **Next.js 15.3.5** - Framework React con App Router
- **React 19.0.0** - Biblioteca de UI
- **Sass 1.89.2** - Preprocesador CSS

### Herramientas de Desarrollo
- **ESLint** - Linter de código
- **Jest 30.0.4** - Framework de testing
- **@testing-library** - Utilidades de testing para React
- **Mock Service Worker (MSW) 2.10.3** - Mock de APIs para desarrollo y testing

### Características del Setup
- **Turbopack** habilitado para desarrollo más rápido
- **SCSS Modules** para estilos component-scoped
- **Testing** configurado con Jest y React Testing Library
- **Mock API** con MSW para simular backend

## 🎨 Diseño y UX

El diseño sigue los patrones visuales de **MercadoLibre**:
- **Colores primarios**: Amarillo (#FFE600), Azul (#3483FA)
- **Tipografía**: Sans-serif, legible y accesible
- **Layout**: Clean, espaciado adecuado, jerarquía visual clara
- **Interacciones**: Feedback visual, estados de loading y error

## 🔧 Decisiones Técnicas

### 📝 Log de Decisiones

> **Instrucciones**: 
- Crear Mock web server para simulacion de api
**Solución Adoptada**: 
- Se hizo el MWS de tal forma que pueda retornar los datos como si fuera una api de verdad, incluyendo un delay para simular estados de carga y ver como se comporta la app con conexiones lentas

---


