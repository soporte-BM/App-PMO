# PMO Profitability Suite

Aplicación web para la gestión y análisis de rentabilidad de proyectos de consultoría.
Diseñada con una arquitectura "Zero-Dependency" para máxima portabilidad y seguridad.

## 🚀 Cómo ejecutar
Simplemente abre el archivo `index.html` en tu navegador web moderno favorito (Chrome, Edge, Firefox).
No requiere instalación de servidores ni bases de datos.

## 🏗 Arquitectura
La aplicación sigue un patrón MVC (Model-View-Controller) simplificado en el lado del cliente:

- **Core (`src/bundle.js`)**: Contiene toda la lógica de negocio.
    - `AnalyticsService`: Motor de cálculo de márgenes y alertas inteligentes.
    - `StorageService`: Capa de persistencia (usa LocalStorage del navegador).
    - `DashboardView`: Lógica de presentación y gráficos.
- **Estilos (`styles/`)**:
    - `main.css`: Variables globales y layout base.
    - `dashboard.css`: Grid system para los reportes tipo Power BI.
    - `forms.css`: Estilos para formularios de alta usabilidad.

## 💡 Funcionalidades Clave
1. **Dashboard Ejecutivo**: KPIs en tiempo real, alertas visuales (Rojo/Amarillo/Verde).
2. **Alertas Tempranas**:
   - 🔴 **Crítico**: Margen < 10%
   - 🟡 **Riesgo**: Margen < 20%
   - 🟢 **Saludable**: Margen ≥ 20%
3. **Análisis Automático**: El sistema explica *por qué* un proyecto tiene baja rentabilidad (ej. "Costo laboral excesivo").
4. **Persistencia**: Los datos se guardan automáticamante en tu navegador.

## 🔮 Escalabilidad
El código está diseñado para ser modular. Para agregar un módulo de RRHH:
1. Crear una nueva "View" en el objeto `App`.
2. Extender el modelo de datos en `StorageService`.
3. Agregar la lógica de cálculo en un nuevo servicio (ej. `HrService`).

---
*Desarrollado con estándares modernos de Web: HTML5, CSS3, ES6+.*
