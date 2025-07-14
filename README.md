# Frontend Challenge - Buscador de Productos

## Descripción del Desafío

Este proyecto es un desafío práctico de frontend que consiste en crear una aplicación web de búsqueda de productos inspirada en **MercadoLibre**. El objetivo es demostrar habilidades en desarrollo frontend moderno, integrando buenas prácticas de UX/UI, manejo de estado, y consumo de APIs.

### Funcionalidades Principales

El desafío se compone de tres partes fundamentales:

1. **🔍 Buscador**: Implementar una barra de búsqueda funcional que permita buscar productos
2. **📋 Lista de Resultados**: Mostrar los resultados de búsqueda en una interfaz clara y organizada
3. **📄 Detalle del Producto**: Crear una vista detallada para cada producto seleccionado

## Estado del Proyecto

### Funcionalidades Completadas

#### **Parte Obligatoria**
- [x] **Caja de búsqueda** - Componente SearchBox con validación y sanitización
- [x] **Visualización de resultados** - Lista de productos con diseño ML
- [x] **Estados de carga** - Skeleton loading profesional
- [x] **Manejo de errores** - Mensajes amigables
- [x] **Sin resultados** - Estado educativo con sugerencias

#### **Extras Opcionales**
- [x] **Detalle del producto** - Vista individual de un producto completada
- [x] **SEO básico**
- [x] **Accesibilidad**
- [x] **Diseño responsive** - Mobile-first
- [x] **Validaciones** - Sanitización XSS, límites de caracteres, input validation
- [x] **Estados de error** - Retry automático y mensajes contextuales

#### Cosas que hubiera realizado con más tiempo
- Usaria zustand para crear una caché de busqueda asi mejoraría la perfomance de las busquedas y evitaria las 
busquedas duplicadas. Además podria hacer un Storage con las busquedas realizadas y armar un historial de 
busqueda.
- En caso de tener mas informacion en el mock respecto a los productos y a su detalle, podría armar una visual 
más similar a lo que es Mercado Libre
- Armaria un despliegue para poder acceder al desafio mediante una URL pública

### Pendientes
- [ ] **Terminar test** - Tests unitarios y de integración
- [ ] **Revisar SEO, accesibilidad y sanitización de inputs**

## Instalación y Setup

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Francosantander/frontend-challenge.git
   cd frontend-challenge/frontend-challenge
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

```bash
npm run dev        # Modo desarrollo con Turbopack
npm run build      # Build de producción
npm run start      # Ejecutar build de producción
```

## Arquitectura del Proyecto

```
frontend-challenge/
├── src/
│   ├── app/                           # App Router
│   │   ├── layout.js                  # Layout principal
│   │   ├── page.js                    # Página home con buscador
│   │   ├── search/                    # Ruta de busqueda
│   │   │   └── page.js                # Página de resultados de búsqueda
│   │   ├── items/                     # Ruta de productos
│   │   │   └── [id]/                  # Ruta dinámica para detalle
│   │   │       └── page.js            # Página de detalle de producto
│   │   └── globals.css                # Reset CSS base
│   ├── components/                    # Componentes reutilizables
│   │   ├── layout/                    # Componentes de layout
│   │   │   ├── ClientLayout.js        # Orquestación de estado de búsqueda
│   │   │   ├── MSWProvider.js         # Provider de Mock Service Worker
│   │   │   └── Topbar/                
│   │   │       ├── Topbar.js          # Componente topbar
│   │   │       └── Topbar.module.scss # Estilos del topbar
│   │   ├── search/                    # Componentes de búsqueda
│   │   │   ├── SearchBox/             
│   │   │   │   ├── SearchBox.js       # Caja de búsqueda
│   │   │   │   └── SearchBox.module.scss
│   │   │   └── SearchResults/         # Resultados de búsqueda
│   │   │       ├── SearchResults.js   # Lista de productos
│   │   │       ├── SearchResults.module.scss
│   │   │       ├── SkeletonCard.js    # Loading skeletons
│   │   │       └── SkeletonCard.module.scss
│   │   └── product/                   # Componentes de producto
│   │       └── ProductDetail/         # Vista de detalle de producto
│   │           ├── ProductDetail.js   # Componente principal
│   │           ├── ProductDetail.module.scss
│   │           ├── ProductGallery.js  # Galería de imágenes
│   │           ├── ProductGallery.module.scss
│   │           ├── ProductInfo.js     # Información del producto
│   │           ├── ProductInfo.module.scss
│   │           ├── BackButton.js      # Botón de retroceso
│   │           └── BackButton.module.scss
│   ├── hooks/                         # Custom hooks
│   │   ├── useProductSearch.js        # Hook de búsqueda
│   │   ├── useProductDetail.js        # Hook para detalle de producto
│   │   └── useIsMobile.js             # Hook de detección móvil
│   ├── mocks/                         # Simulación de API
│   │   ├── handlers.js                # Handlers de API mock extendidos
│   │   ├── browser.js                 # Configuración MSW browser
│   │   ├── server.js                  # Configuración MSW server
│   │   └── data.js                    # Datos mock ampliados
│   ├── styles/                        # Estilos globales
│   │   ├── globals.scss               # Variables CSS y utilidades
│   │   └── _variables.scss            # Variables CSS
│   └── __tests__/                     # Tests
│       └── useProductSearch.test.js   
├── public/                            
│   └── mockServiceWorker.js           # Service Worker de MSW
├── jest.config.js                     # Configuración de Jest
├── setupTests.js                      
└── README.md                          
```

## Stack Tecnológico

### **Framework y Core**
- **Next.js 15.3.5** 
- **React 19.0.0**
- **Sass 1.89.2**

### **Estado y Datos**
- **Custom Hooks** - useProductSearch para manejo de estado
- **Mock Service Worker 2.10.3** - Simulación de API realista
- **useState + useCallback** - Manejo de estados con hooks nativos
- **App Routing**

### **Testing y Calidad**
- **Jest 30.0.4** - Framework de testing
- **@testing-library/react** - Testing utilities
- **ESLint** - Linter de código


## Decisiones Técnicas

### **1. Estado Local con Hooks Nativos**

Manejo de estado de búsqueda sin librerías externas, Custom hook `useProductSearch`,`useProductDetail` y `useIsMobile` con useState y useCallback

### **2. Arquitectura modular**
Separación de responsabilidades entre lógica y UI, componentes reutilizables, un archivo de estilo por componente y testing aislado

### **3. Mock Service Worker para API Simulation**
**Problema**: Simular API realista sin backend
**Solución**: MSW con handlers que simulan API de MercadoLibre

### **4. Skeleton Loading**
Utilizo skeleton para replicar la estructura de los productos mientras carga la información de búsqueda

### **5. CSS Modules + Design System**
Estilos escalables y mantenibles, definicion de variables css para consistencia visual. Podria migrarse a Tailwind

Implementación diseño responsive -> Mobile First

Accesibilidad básica Implementada

### **6. App Routing**
Hice rutas dinamicas para las busquedas de productos y el detalle de los mismos.
- `/search` - Página dedicada para resultados de búsqueda
- `/items/[id]` - Página dinámica para detalle de productos

### **7. Sistema de Detección de Dispositivo**
- **Hook `useIsMobile`** - Detección de dispositivos móviles
- **Renderizado condicional** - Componentes optimizados para mobile y desktop

### **8. Sistema de Retry para fetch hacia MSW**
- **Detección automática** - Identifica cuando MSW no está listo
- **Retry inteligente** - Backoff exponencial para reducir carga
- **Manejo de errores** - Mensajes contextuales
