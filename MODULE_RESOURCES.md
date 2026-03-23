# Módulo de Rentabilidad por Profesional - PMO Suite

Este módulo extiende la PMO Profitability Suite para permitir un control granular de costos y márgenes a nivel de consultor.

## 🌟 Funcionalidades Nuevas

### 1. Gestión de Recursos (Maestro de Tarifas)
- **Vista**: `Recursos` (Icono 👥)
- **Funcionalidad**: 
    - Carga masiva desde Excel (`.xlsx`).
    - Edición rápida de tarifas de Costo (Break-even) y Venta.
    - Persistencia en navegador.
- **Formato Excel Esperado**:
    - Columnas (encabezados flexibles): `Nombre`, `Rol`, `Costo` (para Break-even), `Tarifa` (para Venta).
    - Ejemplo:
      | Nombre | Rol | Costo | Tarifa |
      |--------|-----|-------|--------|
      | Juan   | Dev | 20000 | 50000  |

### 2. Carga Mensual de Horas (Timesheets)
- **Vista**: `Gestión Mensual` (Icono 📅)
- **Flujo**:
    1.  Crear mes/proyecto.
    2.  Seleccionar recursos del dropdown (se pobla automáticamente del maestro).
    3.  Ingresar horas.
    4.  El sistema captura las tarifas vigentes en ese momento (snapshot) para evitar cambios históricos si se cambia la tarifa después.

### 3. Dashboard Avanzado
- **Gráficos**:
    - Ranking de Rentabilidad por Profesional (Horizontal Bar Chart).
    - Rentabilidad por Proyecto (Vertical Bar Chart).
- **Tablas Detalladas**:
    - Desglose línea por línea de: Proyecto > Profesional > Horas > Margen > Rentabilidad %.
- **Alertas**:
    - Se identifican automáticamente profesionales con margen < 10%.

## 🛠 Detalles Técnicos
- **Librería Excel**: Se integró `Different` (SheetJS) vía CDN para procesar archivos localmente sin subirlos a ningún servidor.
- **Estructura de Datos**:
    - `pmo_app_resources_v1`: Array de objetos `{id, name, costRate, billRate}`.
    - `pmo_app_entries_v1`: Ahora guarda objetos completos de profesionales con sus tarifas al momento de la carga.

## 🚀 Cómo usar
1.  Abre `index.html`.
2.  Ve a la pestaña **Recursos**.
3.  Carga tu Excel de tarifas o usa el botón "+ Nuevo Recurso" para agregar datos de prueba.
4.  Ve a **Gestión Mensual** y carga las horas del mes.
5.  Analiza los resultados en el **Dashboard**.

---
*Desarrollado para ejecución local segura.*
