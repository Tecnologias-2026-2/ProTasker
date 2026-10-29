# ProTasker

ProTasker es una aplicación web de demostración para organizar actividades académicas. Permite gestionar tareas, consultar fechas en un calendario, revisar el progreso semanal y enfocarse en una actividad desde un mismo panel.

## Integrantes

- Nombre completo — Código
- Nombre completo — Código

## 1. Objetivo General

Desarrollar una aplicación web que ayude a estudiantes a organizar sus actividades académicas mediante la creación y seguimiento de tareas, la planificación de fechas de entrega y la consulta de su progreso, con el fin de reducir olvidos y facilitar la priorización del trabajo pendiente.

## 2. Contexto de Uso

ProTasker está pensado para estudiantes que desean organizar tareas y entregas individuales. Se utiliza desde un navegador moderno en computadora, tablet o teléfono. El usuario puede crear tareas con descripción, fecha, hora y prioridad, y luego consultarlas en el panel principal, el calendario, el historial de progreso o el modo enfoque.

La aplicación utiliza Firebase Authentication para registrar e iniciar sesión con correo y contraseña o con Google, y Cloud Firestore para guardar y sincronizar las tareas de cada usuario. Para ejecutarla, primero configura los proveedores de acceso en un proyecto Firebase propio y publica las reglas de seguridad incluidas.

## 3. Requerimientos del Sistema

### 3.1 Requerimientos Funcionales

- **RF01:** El sistema debe mostrar una portada con información de ProTasker y sus funciones principales.
- **RF02:** El sistema debe permitir registrar e iniciar sesión con correo/contraseña o Google mediante Firebase Authentication.
- **RF03:** El sistema debe guardar las tareas en Cloud Firestore, aisladas por el identificador de cada usuario autenticado.
- **RF04:** El sistema debe permitir crear, editar, completar, reabrir y eliminar tareas.
- **RF05:** Cada tarea debe incluir título, descripción opcional, fecha, hora, prioridad y estado de completado.
- **RF06:** El sistema debe mostrar tareas de hoy, próximas y urgentes. Se consideran urgentes las tareas pendientes de prioridad alta o con entrega hoy o dentro de los próximos dos días.
- **RF07:** El sistema debe sincronizar los cambios de tareas con Firestore en tiempo real.
- **RF08:** El sistema debe mostrar un calendario mensual con navegación entre meses, selección de fechas y consulta de tareas asociadas.
- **RF09:** El sistema debe mostrar un resumen de tareas completadas durante los últimos siete días, tareas pendientes y porcentaje de tareas vencidas completadas.
- **RF10:** El sistema debe permitir seleccionar una tarea pendiente en el modo enfoque y consultar sus detalles, editarla o completarla.
- **RF11:** El sistema debe permitir cerrar sesión y regresar a la portada.

Las notificaciones y los recordatorios aparecen como elementos de interfaz, pero todavía no están conectados a servicios ni tienen su funcionamiento completo implementado.

### 3.2 Requerimientos No Funcionales

- **RNF01:** La interfaz debe adaptarse a pantallas de móvil, tablet y escritorio.
- **RNF02:** La estructura debe utilizar HTML semántico y estilos basados en CSS Grid y Flexbox.
- **RNF03:** Los formularios deben incluir etiquetas, controles nativos y validación del navegador.
- **RNF04:** Las acciones principales deben poder utilizarse con teclado y mostrar indicadores de foco.
- **RNF05:** La interfaz debe contemplar nombres accesibles para controles, estados de navegación y preferencia de movimiento reducido.
- **RNF06:** La aplicación utiliza el SDK web de Firebase cargado desde el CDN oficial y no requiere framework ni proceso de compilación.

La implementación incorpora prácticas básicas de accesibilidad, pero no representa una certificación WCAG. Se recomienda complementarla con auditorías automatizadas y pruebas con tecnologías de asistencia.

## 4. Diagramas UML

### Diagrama de Casos de Uso

El diagrama debe representar al estudiante como actor y sus acciones principales: acceder al prototipo, gestionar tareas, consultar el calendario y el progreso, y utilizar el modo enfoque. Los diagramas UML aún no están incluidos en los archivos del proyecto.

### Diagrama de Secuencia

El diagrama puede representar el flujo de creación de una tarea: el estudiante completa el formulario, la interfaz valida los campos, guarda la tarea en Firestore y actualiza las listas, el calendario y los indicadores del panel. Este diagrama aún debe agregarse como entregable.

## 5. URL del Prototipo

[Abrir el prototipo de ProTasker en Figma](https://www.figma.com/make/RF3eCJptOFSa9PIAa7MoFF/Aplicacion--Copy-?t=NlNwoVnTjMxnLTlD-1)

El enlace puede requerir permisos de Figma. La aplicación actual también incluye vistas y funciones implementadas después del prototipo.

## 6. Diseño de Base de Datos

La aplicación usa Firebase Authentication para las cuentas. Firebase conserva el correo y el nombre de perfil; las contraseñas las administra Authentication y no se guardan en Firestore. Las tareas se guardan en Cloud Firestore con esta estructura:

```text
users/{uid}/tasks/{taskId}
```

Cada usuario solo puede leer y modificar documentos bajo su propio `uid`. Las reglas correspondientes están en `firestore.rules` y deben publicarse en Firebase antes de usar la base de datos.

Cada tarea guardada contiene:

| Campo | Descripción |
|---|---|
| `id` | Identificador del documento de Firestore. |
| `title` | Título de la actividad. |
| `description` | Descripción opcional. |
| `date` | Fecha de entrega. |
| `time` | Hora de entrega. |
| `priority` | Prioridad baja, media o alta. |
| `completed` | Estado actual de completado. |
| `completedAt` | Fecha y hora de finalización o `null` si la tarea está pendiente. |

El estado actual conserva el estado de cada tarea, pero no registra un historial inmutable de todos sus cambios. Las tareas que se hubieran guardado previamente en el almacenamiento local del navegador no se migran automáticamente.

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
│   ├── firebase-config.js
│   ├── firebase.js
│   ├── progress.js
│   └── tasks.js
├── firestore.rules
└── skills/
    ├── accessibility/
    ├── best-practices/
    ├── core-web-vitals/
    ├── performance/
    ├── seo/
    └── web-quality-audit/
```

- `index.html`: estructura semántica y contenido de la portada, autenticación, panel y formulario de tareas.
- `css/`: estilos visuales, componentes, estados de interacción y adaptación a tamaños de pantalla.
- `css/styles.css`: hoja principal de estilos, con el tema, layouts Grid/Flexbox y media queries.
- `assets/`: recursos estáticos; actualmente no contiene recursos adicionales.
- `scripts/app.js`: flujo entre portada, inicio de sesión, registro y panel.
- `scripts/firebase-config.js`: configuración pública del proyecto Firebase que debes completar antes de ejecutar la aplicación.
- `scripts/firebase.js`: inicialización de Firebase Authentication y Cloud Firestore, y operaciones de cuentas y tareas.
- `scripts/features.js`: interacción de las tarjetas de funciones de la portada.
- `scripts/tasks.js`: formulario, tarjetas, acciones y sincronización de tareas con Firestore.
- `scripts/dashboard.js`: navegación del panel, métricas, acciones rápidas y modo enfoque.
- `scripts/calendar.js`: calendario mensual y consulta de tareas por fecha.
- `scripts/progress.js`: indicadores semanales y gráfica de actividad.
- `skills/`: referencias de calidad web disponibles en el repositorio.

Los archivos JavaScript se cargan como scripts clásicos con `defer`, en el orden declarado al final de `index.html`. El SDK de Firebase se carga desde el CDN oficial. No se necesita un proceso de compilación.

### Funcionamiento de las Vistas

- **Portada:** presenta el producto y permite expandir tarjetas de funciones.
- **Inicio de sesión:** Firebase Authentication valida el correo y la contraseña, o autentica mediante una ventana emergente de Google. Si existe una sesión activa, se restaura al volver a cargar la aplicación.
- **Registro:** crea una cuenta de Firebase Authentication con nombre, correo y contraseña. Firebase administra la contraseña; la aplicación no la almacena en la base de datos.
- **Panel de inicio:** muestra la fecha, racha, tareas completadas hoy, pendientes, accesos rápidos y listas de tareas.
- **Mis tareas:** permite crear, editar, completar, reabrir y eliminar tareas; eliminar solicita confirmación.
- **Calendario:** muestra tareas por día y permite cambiar de mes o volver al día actual.
- **Historial y progreso:** calcula las tareas completadas en los últimos siete días y otros indicadores a partir de las tareas sincronizadas.
- **Modo enfoque:** presenta las tareas pendientes y permite actuar sobre la tarea seleccionada.
- **Cerrar sesión:** finaliza la sesión de Firebase y regresa a la portada. Las tareas permanecen en Firestore.

## 8. Instalación y Ejecución

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/) y registrar una aplicación web.
2. Activar **Authentication → Proveedores de acceso → Correo electrónico/contraseña** y **Google**. Al configurar Google, selecciona un correo de asistencia del proyecto.
3. Crear una base de datos en **Firestore Database**.
4. Copiar la configuración de la aplicación web en `scripts/firebase-config.js`. Los valores de configuración del cliente se publican en el navegador; no pongas contraseñas ni claves privadas en ese archivo.
5. Publicar las reglas de `firestore.rules` en la sección **Reglas** de Firestore.
6. Desplegar la aplicación con `npx -y firebase-tools@latest deploy --only hosting`.
7. Abrir la URL HTTPS que muestra Firebase Hosting (por ejemplo, `https://protaskerhtml.web.app`) y usar **Comenzar gratis** o **Google** para crear/iniciar sesión. Para probarla localmente, usar `http://localhost` o `http://127.0.0.1` y autorizar ese dominio en **Authentication → Settings → Authorized domains**.
8. Crear tareas desde **Mis tareas** para probar su sincronización, el calendario, las urgencias, el progreso y el modo enfoque.

No se requiere `npm install`. Después del despliegue, la aplicación queda disponible en HTTPS desde cualquier navegador, sin mantener un servidor local abierto. El proyecto y los servicios de Firebase deben estar configurados para que el registro, el inicio de sesión y el guardado funcionen. Si la configuración falta o es inválida, la interfaz muestra un mensaje en lugar de simular un inicio de sesión.
