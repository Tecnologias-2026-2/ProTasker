# ProTasker

ProTasker es una aplicación web de demostración para organizar actividades académicas. Permite gestionar tareas, consultar fechas en un calendario, revisar el progreso semanal y enfocarse en una actividad desde un mismo panel.

## Integrantes

- Alejandro Ramírez Díaz — 1202749
- Julián Sebastián Lozada Lozano — 1202799
- Miguél Andrés Lguizamón Monroy - 1202741

## 1. Objetivo General

Desarrollar una aplicación web que ayude a estudiantes a organizar sus actividades académicas mediante la creación y seguimiento de tareas, la planificación de fechas de entrega y la consulta de su progreso, con el fin de reducir olvidos y facilitar la priorización del trabajo pendiente.

## 2. Contexto de Uso

ProTasker está pensado para estudiantes que desean organizar tareas y entregas individuales. Se utiliza desde un navegador moderno en computadora, tablet o teléfono. El usuario puede crear tareas con descripción, fecha, hora y prioridad, y luego consultarlas en el panel principal, el calendario, el historial de progreso o el modo enfoque.

La aplicación usa Firebase Authentication para las cuentas y Cloud Firestore para guardar las tareas por usuario. El calendario de ProTasker también puede sincronizarlas con el calendario principal de una cuenta Google elegida por el usuario.

## 3. Requerimientos del Sistema

### 3.1 Requerimientos Funcionales

- **RF01:** Creación de rutinas: el sistema debe gestionar los hábitos que el usuario registre, permitiendo crearlos, editarlos y eliminarlos.
- **RF02:** Categorización: el usuario clasificará sus tareas en el ámbito académico, laboral o personal.
- **RF03:** Checklist: el usuario podrá marcar una tarea como completada al finalizarla.
- **RF04:** Calendario: visualización de eventos en formato semanal o mensual.
- **RF05:** Logros: el usuario desbloquea logros al completar eventos en días consecutivos (racha).
- **RF06:** Modo Enfoque: bloqueo de notificaciones externas durante el tiempo establecido por el usuario.

### 3.2 Requerimientos No Funcionales

- **RNF01:** Interfaz y usabilidad: La aplicación deberá contar con un diseño intuitivo, organizado y fácil de comprender, permitiendo que el usuario acceda a las funciones principales sin dificultad. La navegación deberá ser clara, coherente y consistente en todas las pantallas, garantizando una experiencia de usuario fluida.
- **RNF02:** Accesibilidad: El sistema deberá incluir opciones que faciliten su uso a diferentes tipos de usuarios, tales como ajuste de tamaño de texto, contraste adecuado de colores y compatibilidad con herramientas de accesibilidad propias del sistema operativo.
- **RNF03:** Rendimiento: La aplicación deberá presentar tiempos de carga reducidos y una respuesta rápida ante las acciones del usuario. Asimismo, deberá optimizar el consumo de batería y datos móviles para no afectar el rendimiento general del dispositivo.
- **RNF04:** Disponibilidad: El servicio deberá estar disponible de manera continua, asegurando un funcionamiento estable con mínimos tiempos de inactividad.
- **RNF05:** Portabilidad: capacidad de adaptarse a versión web u otros entornos sin reconstrucción total.
- **RNF06:** Compatibilidad: compatible con Android e iOS, adaptable a diferentes tamaños de pantalla.

## 4. Diagramas UML

### Diagrama de Casos de Uso

El diagrama debe representar al estudiante como actor y sus acciones principales: acceder al prototipo, gestionar tareas, consultar el calendario y el progreso, y utilizar el modo enfoque. Los diagramas UML aún no están incluidos en los archivos del proyecto.

### Diagrama de Secuencia

El diagrama puede representar el flujo de creación de una tarea: el estudiante completa el formulario, la interfaz valida los campos, guarda la tarea en Firestore y actualiza las listas, el calendario y los indicadores del panel. Este diagrama aún debe agregarse como entregable.

## 5. URL del Prototipo

[Abrir el prototipo de ProTasker en Figma](https://www.figma.com/make/RF3eCJptOFSa9PIAa7MoFF/Aplicacion--Copy-?t=NlNwoVnTjMxnLTlD-1)

El enlace puede requerir permisos de Figma. La aplicación actual también incluye vistas y funciones implementadas después del prototipo.

## 6. Diseño de Base de Datos

Las tareas se guardan en Firestore en `users/{uid}/tasks/{taskId}` y solo la cuenta autenticada propietaria puede leerlas o modificarlas. Las asociaciones entre tareas y eventos de Google Calendar se guardan en `users/{uid}/calendarEvents/{taskId}`, y el correo de la cuenta autorizada en `users/{uid}/calendarSettings/googleCalendar`; no se guarda ningún token de Google en Firestore.

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

El estado actual conserva el estado de cada tarea, pero no registra un historial inmutable de todos sus cambios.

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
│   ├── calendar-sync.js
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
- `scripts/tasks.js`: formulario, tarjetas y acciones de tareas, persistidas en Firestore.
- `scripts/calendar-sync.js`: autorización OAuth y sincronización unidireccional de tareas con Google Calendar.
- `scripts/dashboard.js`: navegación del panel, métricas, acciones rápidas y modo enfoque.
- `scripts/calendar.js`: calendario mensual y consulta de tareas por fecha.
- `scripts/progress.js`: indicadores semanales y gráfica de actividad.
- `skills/`: referencias de calidad web disponibles en el repositorio.

Los archivos JavaScript se cargan como scripts clásicos con `defer`, en el orden declarado al final de `index.html`. No se necesita un proceso de compilación.

### Funcionamiento de las Vistas

- **Portada:** presenta el producto y permite expandir tarjetas de funciones.
- **Inicio de sesión y registro:** Firebase Authentication gestiona el acceso con correo y contraseña o con Google. Las tareas se guardan separadas por el identificador de usuario de Firebase.
- **Panel de inicio:** muestra la fecha, racha, tareas completadas hoy, pendientes, accesos rápidos y listas de tareas.
- **Mis tareas:** permite crear, editar, completar, reabrir y eliminar tareas; eliminar solicita confirmación.
- **Calendario:** muestra tareas por día y permite cambiar de mes o volver al día actual. El botón de Google Calendar autoriza una cuenta y sincroniza las tareas con su calendario principal; los cambios se replican automáticamente mientras el permiso esté vigente. Tras recargar la página o vencer el permiso, vuelve a pulsar el botón para autorizar y sincronizar. Los cambios hechos directamente en Google Calendar no se importan a ProTasker.
- **Historial y progreso:** calcula las tareas completadas en los últimos siete días y otros indicadores a partir de las tareas de Firestore.
- **Modo enfoque:** presenta las tareas pendientes y permite actuar sobre la tarea seleccionada.
- **Cerrar sesión:** regresa a la portada; no elimina las tareas guardadas en Firestore.

## 8. Google Calendar

Para activar la sincronización:

1. En Google Cloud Console, habilita **Google Calendar API** en el mismo proyecto de Google usado por Firebase.
2. Configura la pantalla de consentimiento OAuth y crea un cliente de tipo **Aplicación web**. Añade el dominio de ProTasker y `http://localhost` a los orígenes autorizados; para publicar el proyecto, autoriza también el dominio en Firebase Authentication.
3. En `scripts/firebase-config.js`, reemplaza `YOUR_GOOGLE_OAUTH_CLIENT_ID` por el ID de cliente OAuth. Este ID es público y no es un secreto.
4. Publica las reglas actualizadas de Firestore (`firebase deploy --only firestore:rules`).
5. Inicia sesión, abre **Calendario** y pulsa **Conectar Google Calendar**. Autoriza el calendario principal de la cuenta que deseas usar.

La integración crea, actualiza y elimina los eventos de ProTasker al sincronizar; un cambio de tarea se envía automáticamente mientras el permiso OAuth siga activo en esa pestaña. Después de recargar o de que venza el token, pulsa **Conectar Google Calendar** otra vez. La sincronización es de ProTasker hacia Google Calendar, no modifica tareas desde cambios hechos directamente en Google Calendar. El ID de cliente OAuth y Firebase deben tener los dominios locales y publicados autorizados.

## 9. Instalación y Ejecución

1. Clonar el repositorio o descargar los archivos del proyecto.
2. Configurar Firebase en `scripts/firebase-config.js` y publicar las reglas de Firestore.
3. Servir la carpeta mediante Firebase Hosting o un servidor local como Live Server; no abras `index.html` directamente, ya que Firebase Authentication y OAuth necesitan un origen web autorizado.
4. Iniciar sesión o crear una cuenta. Activa los proveedores de correo/contraseña y Google en Firebase Authentication si aún no están habilitados.
5. Crear tareas desde **Mis tareas** y, si se desea, configurar Google Calendar siguiendo la sección anterior.

No se requiere `npm install`. Firebase y Google Cloud deben estar configurados para habilitar la autenticación, el guardado de tareas y la sincronización.