# Estrategia de ramas del proyecto Pausa

## Objetivo

Organizar el desarrollo del proyecto Pausa mediante ramas de Git, separando la versión principal, la integración de cambios, el desarrollo de funcionalidades y la corrección de errores.

## Ramas principales

- `main`: contiene la versión principal del proyecto.
- `develop`: se utiliza como rama de integración para los cambios que se desarrollen.

## Ramas de trabajo

- `feature/inicio`: destinada a los cambios relacionados con la página de inicio.
- `feature/explorar-alojamientos`: destinada a la exploración de alojamientos.
- `feature/busqueda-alojamientos`: destinada a la búsqueda de alojamientos.
- `feature/filtros-alojamientos`: destinada a los filtros de alojamientos.
- `feature/favoritos`: destinada a la gestión de favoritos.
- `feature/detalle-alojamiento`: destinada a la vista de detalle de un alojamiento.
- `feature/navegacion-footer`: destinada a los cambios de navegación y pie de página.
- `feature/documentacion-ramas`: destinada a la documentación del control de versiones.
- `fix/correccion-filtros`: destinada a las correcciones relacionadas con los filtros.

## Flujo de trabajo propuesto

1. Seleccionar la rama correspondiente a la tarea.
2. Realizar los cambios necesarios y probarlos.
3. Revisar el estado del repositorio con `git status`.
4. Preparar los archivos con `git add`.
5. Registrar los cambios mediante `git commit`.
6. Publicar la rama con `git push`.
7. Revisar los cambios antes de integrarlos en la rama correspondiente.

## Estado actual

Las ramas indicadas fueron creadas y publicadas en el repositorio remoto. Su existencia organiza el trabajo, pero no implica que todas las funcionalidades descritas estén implementadas ni que las ramas ya hayan sido integradas.