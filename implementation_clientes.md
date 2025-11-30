# Plan de Commit

Este documento resume los cambios pendientes que se subirán al repositorio.

## Resumen de Cambios

Se han detectado modificaciones en el Dashboard, rutas y nuevos módulos de gestión de clientes y ventas.

### Backend (Laravel)

#### [MODIFY] [web.php](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/routes/web.php)
- Se actualizó la ruta `/` para obtener productos con stock bajo y pasarlos al Dashboard.
- Se agregó la ruta `/api/clientes/search` para búsqueda de clientes.

#### [MODIFY] [ClientController.php](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/app/Http/Controllers/ClientController.php)
- (Inferido) Se agregó lógica para búsqueda de clientes.

#### [MODIFY] [SaleController.php](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/app/Http/Controllers/SaleController.php)
- Cambios en la lógica de ventas (por confirmar en revisión final).

### Frontend (React/Inertia)

#### [MODIFY] [Dashboard.tsx](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/resources/js/Pages/Dashboard.tsx)
- Implementación de alertas de stock bajo.
- Actualización de tarjetas de navegación (Ajustes, Usuarios).

#### [MODIFY] [Sidebar.tsx](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/resources/js/Components/Sidebar.tsx)
- Actualización de enlaces de navegación.

#### [NEW] Nuevas Páginas
- [Clientes.tsx](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/resources/js/Pages/Clientes.tsx): Listado de clientes.
- [ClienteDetalle.tsx](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/resources/js/Pages/ClienteDetalle.tsx): Vista detallada de cliente.
- [VentaDetalle.tsx](file:///c:/Users/nahuel/Desktop/repositorio-pruebas/interfaz-laravel-react/resources/js/Pages/VentaDetalle.tsx): Detalle de venta.

## Mensaje de Commit Propuesto

```text
feat: agregar gestión de clientes, alertas de stock y detalles de venta

- Dashboard: Mostrar alertas de productos con stock bajo.
- Clientes: Agregar listado y detalle de clientes.
- Ventas: Agregar vista de detalle de venta.
- Backend: API de búsqueda de clientes y lógica de stock en dashboard.
```

## Verificación
- Se verificará que el comando `git commit` se ejecute correctamente.
- Se verificará que `git push` suba los cambios al remoto.
