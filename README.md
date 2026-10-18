# ProTasker

ProTasker es una aplicación web de demostración para organizar actividades académicas. Permite gestionar tareas, consultar fechas en un calendario, revisar el progreso semanal y enfocarse en una actividad desde un mismo panel.

## Integrantes

- Alejandro Ramírez Díaz — 12027
- Julián Sebastián Lozada Lozano — 1202799
- Miguél Andrés Lguizamón Monroy - 12027

## 1. Objetivo General

Desarrollar una aplicación web que ayude a estudiantes a organizar sus actividades académicas mediante la creación y seguimiento de tareas, la planificación de fechas de entrega y la consulta de su progreso, con el fin de reducir olvidos y facilitar la priorización del trabajo pendiente.

## 2. Contexto de Uso

ProTasker está pensado para estudiantes que desean organizar tareas y entregas individuales. Se utiliza desde un navegador moderno en computadora, tablet o teléfono. El usuario puede crear tareas con descripción, fecha, hora y prioridad, y luego consultarlas en el panel principal, el calendario, el historial de progreso o el modo enfoque.

La versión actual es un prototipo frontend. La autenticación y el registro son simulados, y las tareas se guardan en `localStorage` en el navegador y dispositivo actuales. No se envían datos a un servidor ni se sincronizan entre dispositivos.

## 3. Requerimientos del Sistema

### 3.1 Requerimientos Funcionales

- **RF01:** El sistema debe mostrar una portada con información de ProTasker y sus funciones principales.
- **RF02:** El sistema debe permitir abrir un flujo simulado de inicio de sesión sin conectarse a servicios externos.
- **RF03:** El sistema debe permitir un flujo de registro de demostración con nombre, correo y contraseña.
- **RF04:** El sistema debe mostrar una verificación simulada con el código de demostración `265378`; no debe enviar correos.
- **RF05:** El sistema debe permitir crear, editar, completar, reabrir y eliminar tareas.
- **RF06:** Cada tarea debe incluir título, descripción opcional, fecha, hora, prioridad y estado de completado.
- **RF07:** El sistema debe mostrar tareas de hoy, próximas y urgentes. Se consideran urgentes las tareas pendientes de prioridad alta o con entrega hoy o dentro de los próximos dos días.
- **RF08:** El sistema debe conservar las tareas en el almacenamiento local del navegador, separadas por correo normalizado.
- **RF09:** El sistema debe mostrar un calendario mensual con navegación entre meses, selección de fechas y consulta de tareas asociadas.
- **RF10:** El sistema debe mostrar un resumen de tareas completadas durante los últimos siete días, tareas pendientes y porcentaje de tareas vencidas completadas.
- **RF11:** El sistema debe permitir seleccionar una tarea pendiente en el modo enfoque y consultar sus detalles, editarla o completarla.
- **RF12:** El sistema debe permitir cerrar sesión y regresar a la portada.

El acceso con Google, las notificaciones y los recordatorios aparecen como elementos de interfaz, pero todavía no están conectados a servicios ni tienen su funcionamiento completo implementado.

### 3.2 Requerimientos No Funcionales

- **RNF01:** La interfaz debe adaptarse a pantallas de móvil, tablet y escritorio.
- **RNF02:** La estructura debe utilizar HTML semántico y estilos basados en CSS Grid y Flexbox.
- **RNF03:** Los formularios deben incluir etiquetas, controles nativos y validación del navegador.
- **RNF04:** Las acciones principales deben poder utilizarse con teclado y mostrar indicadores de foco.
- **RNF05:** La interfaz debe contemplar nombres accesibles para controles, estados de navegación y preferencia de movimiento reducido.
- **RNF06:** El prototipo no debe requerir framework, backend ni dependencias externas para abrirse.

La implementación incorpora prácticas básicas de accesibilidad, pero no representa una certificación WCAG. Se recomienda complementarla con auditorías automatizadas y pruebas con tecnologías de asistencia.

## 4. Diagramas UML

### Diagrama de Casos de Uso

El diagrama debe representar al estudiante como actor y sus acciones principales: acceder al prototipo, gestionar tareas, consultar el calendario y el progreso, y utilizar el modo enfoque. Los diagramas UML aún no están incluidos en los archivos del proyecto.

### Diagrama de Secuencia

El diagrama puede representar el flujo de creación de una tarea: el estudiante completa el formulario, la interfaz valida los campos, guarda la tarea en `localStorage` y actualiza las listas, el calendario y los indicadores del panel. Este diagrama aún debe agregarse como entregable.

## 5. URL del Prototipo

[Abrir el prototipo de ProTasker en Figma](https://www.figma.com/make/RF3eCJptOFSa9PIAa7MoFF/Aplicacion--Copy-?t=NlNwoVnTjMxnLTlD-1)

El enlace puede requerir permisos de Figma. La aplicación actual también incluye vistas y funciones implementadas después del prototipo.

## 6. Diseño de Base de Datos

La versión actual no utiliza una base de datos. Las tareas se serializan como JSON en `localStorage`, con una clave separada para cada correo normalizado. Los datos permanecen en el navegador actual; borrar los datos del sitio los elimina. No hay sincronización con un backend.

Cada tarea guardada contiene:

| Campo | Descripción |
|---|---|
| `id` | Identificador generado en el navegador. |
| `title` | Título de la actividad. |
| `description` | Descripción opcional. |
| `date` | Fecha de entrega. |
| `time` | Hora de entrega. |
| `priority` | Prioridad baja, media o alta. |
| `completed` | Estado actual de completado. |
| `completedAt` | Fecha y hora de finalización o `null` si la tarea está pendiente. |

No hay tablas SQL ni imagen de un modelo de base de datos en el repositorio. El estado actual conserva el estado de cada tarea, pero no registra un historial inmutable de todos sus cambios.

## 7. Documentación del Sistema

### Estructura de Carpetas

```text
ProTasker/
├── index.html
├── README.md
├── assets/
├── css/
│   └── styles.css
├── scripts/
│   ├── app.js
│   ├── calendar.js
│   ├── dashboard.js
│   ├── features.js
│   ├── progress.js
│   └── tasks.js
└── skills/
    ├── accessibility/
    ├── best-practices/
    ├── core-web-vitals/
    ├── performance/
    ├── seo/
    └── web-quality-audit/
```

- `index.html`: estructura semántica y contenido de la portada, autenticación, verificación, panel y formulario de tareas.
- `css/`: estilos visuales, componentes, estados de interacción y adaptación a tamaños de pantalla.
- `css/styles.css`: hoja principal de estilos, con el tema, layouts Grid/Flexbox y media queries.
- `assets/`: recursos estáticos; actualmente no contiene recursos adicionales.
- `scripts/app.js`: flujo entre portada, inicio de sesión, registro, verificación y panel.
- `scripts/features.js`: interacción de las tarjetas de funciones de la portada.
- `scripts/tasks.js`: formulario, tarjetas, acciones y persistencia local de tareas.
- `scripts/dashboard.js`: navegación del panel, métricas, acciones rápidas y modo enfoque.
- `scripts/calendar.js`: calendario mensual y consulta de tareas por fecha.
- `scripts/progress.js`: indicadores semanales y gráfica de actividad.
- `skills/`: referencias de calidad web disponibles en el repositorio.

Los archivos JavaScript se cargan como scripts clásicos con `defer`, en el orden declarado al final de `index.html`. No se necesita un proceso de compilación.

### Funcionamiento de las Vistas

- **Portada:** presenta el producto y permite expandir tarjetas de funciones.
- **Inicio de sesión:** cualquier correo y contraseña que cumplan la validación HTML abre el panel; no se autentica una cuenta real. El nombre mostrado se obtiene de la parte del correo anterior a `@`.
- **Registro:** solicita nombre, correo y contraseña, y lleva a la pantalla de verificación de demostración.
- **Verificación:** el código `265378` abre el panel. Un código incorrecto muestra un mensaje; reenviar solo vuelve a mostrar el código en pantalla.
- **Panel de inicio:** muestra la fecha, racha, tareas completadas hoy, pendientes, accesos rápidos y listas de tareas.
- **Mis tareas:** permite crear, editar, completar, reabrir y eliminar tareas; eliminar solicita confirmación.
- **Calendario:** muestra tareas por día y permite cambiar de mes o volver al día actual.
- **Historial y progreso:** calcula las tareas completadas en los últimos siete días y otros indicadores a partir de las tareas locales.
- **Modo enfoque:** presenta las tareas pendientes y permite actuar sobre la tarea seleccionada.
- **Cerrar sesión:** regresa a la portada; no elimina las tareas guardadas localmente.

## 8. Instalación y Ejecución

1. Clonar el repositorio o descargar los archivos del proyecto.
2. Abrir `index.html` directamente en un navegador moderno, o servir la carpeta con una extensión como Live Server en Visual Studio Code.
3. Seleccionar **Iniciar sesión** para acceder al panel de demostración, o **Comenzar gratis** para probar el registro.
4. En el flujo de registro, ingresar el código de verificación `265378`.
5. Crear tareas desde **Mis tareas** para probar el calendario, las urgencias, el progreso y el modo enfoque.

No se requiere `npm install`, configuración de base de datos ni credenciales. Los datos creados son de demostración y se almacenan únicamente en el navegador actual.
