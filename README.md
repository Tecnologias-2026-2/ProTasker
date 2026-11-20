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

La aplicación usa Firebase Authentication para el registro y el inicio de sesión, y Cloud Firestore para conservar y sincronizar las tareas por usuario. Una API REST en Node.js y Express valida el token de Firebase y realiza las escrituras y operaciones del calendario mediante Firebase Admin SDK. La interfaz mantiene una suscripción de Firestore para reflejar los cambios de tareas en tiempo real.

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

El diagrama puede representar el flujo de creación de una tarea: el estudiante completa el formulario, la interfaz envía la solicitud autenticada a la API, el servidor valida y guarda la tarea en Firestore, y la suscripción actualiza las listas, el calendario y los indicadores del panel. Este diagrama aún debe agregarse como entregable.

## 5. URL del Prototipo

[Abrir el prototipo de ProTasker en Figma](https://www.figma.com/make/RF3eCJptOFSa9PIAa7MoFF/Aplicacion--Copy-?t=NlNwoVnTjMxnLTlD-1)

El enlace puede requerir permisos de Figma. La aplicación actual también incluye vistas y funciones implementadas después del prototipo.

## 6. Diseño de Base de Datos

La aplicación usa Firestore Standard en el proyecto `protaskerhtml`. Cada usuario tiene sus documentos en `users/{uid}`:

| Subcolección | Documento | Campos |
|---|---|---|
| `tasks` | ID de tarea | `id`, `title`, `description`, `date`, `time`, `priority`, `completed`, `completedAt` |
| `calendarEvents` | ID de tarea | `eventId` de Google Calendar |
| `calendarSettings` | `googleCalendar` | `email` de la cuenta vinculada |

Cada tarea contiene estos campos:

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

Los documentos pertenecen al UID autenticado. La API toma el UID del token verificado, no del cuerpo de la solicitud, y no incluye credenciales de administrador en el navegador.

## 7. Documentación del Sistema

### Estructura de Carpetas

```text
ProTasker/
├── index.html
├── README.md
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── render.yaml
├── assets/
├── css/
│   └── styles.css
├── scripts/
│   ├── app.js
│   ├── api-config.js
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
- `scripts/tasks.js`: formulario, tarjetas y acciones de tareas.
- `scripts/firebase.js`: autenticación, suscripción de tareas en tiempo real y cliente autenticado de la API.
- `scripts/api-config.js`: URL pública de la API de Render.
- `backend/`: API Express con rutas, controladores, modelos, validación y conexión a Firebase Admin SDK.
- `scripts/dashboard.js`: navegación del panel, métricas, acciones rápidas y modo enfoque.
- `scripts/calendar.js`: calendario mensual y consulta de tareas por fecha.
- `scripts/progress.js`: indicadores semanales y gráfica de actividad.
- `skills/`: referencias de calidad web disponibles en el repositorio.

Los archivos JavaScript se cargan como scripts clásicos con `defer`, en el orden declarado al final de `index.html`. No se necesita un proceso de compilación.

### Funcionamiento de las Vistas

- **Portada:** presenta el producto y permite expandir tarjetas de funciones.
- **Inicio de sesión y registro:** Firebase Authentication gestiona las cuentas y la sesión.
- **Panel de inicio:** muestra la fecha, racha, tareas completadas hoy, pendientes, accesos rápidos y listas de tareas.
- **Mis tareas:** permite crear, editar, completar, reabrir y eliminar tareas; eliminar solicita confirmación.
- **Calendario:** muestra tareas por día y permite cambiar de mes o volver al día actual.
- **Historial y progreso:** calcula las tareas completadas en los últimos siete días y otros indicadores a partir de las tareas de Firestore.
- **Modo enfoque:** presenta las tareas pendientes y permite actuar sobre la tarea seleccionada.
- **Cerrar sesión:** Firebase Authentication cierra la sesión; las tareas permanecen en Firestore.

## 8. API y despliegue en Render

La API expone estos endpoints bajo `/api`; todos requieren `Authorization: Bearer <Firebase ID token>`:

| Método | Ruta | Operación |
|---|---|---|
| `GET` | `/api/tasks` | Listar las tareas del usuario autenticado |
| `PUT` | `/api/tasks/:taskId` | Crear o actualizar una tarea |
| `DELETE` | `/api/tasks/:taskId` | Eliminar una tarea |
| `GET` | `/api/calendar-events` | Listar vínculos de eventos de Google Calendar |
| `PUT` | `/api/calendar-events/:taskId` | Guardar el ID del evento vinculado |
| `DELETE` | `/api/calendar-events/:taskId` | Eliminar el vínculo de un evento |
| `GET`, `PUT` | `/api/calendar-events/account` | Consultar o guardar el correo de Google Calendar |
| `GET` | `/health` | Comprobación de disponibilidad para Render |

### Desplegar la API

1. En Render, crea un **Blueprint** desde este repositorio para que lea `render.yaml`; el servicio `protasker-api` usa `backend/` como directorio raíz.
2. Crea una cuenta de servicio de Google Cloud para Firebase Admin SDK con acceso a Firestore (rol `Cloud Datastore User`) en el proyecto `protaskerhtml`.
3. En las variables de entorno del servicio Render, configura `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY` con los datos de esa cuenta. Conserva la clave privada solo en Render o en un `.env` local ignorado por Git; nunca la publiques ni la agregues al repositorio.
4. `FIREBASE_PROJECT_ID` y `FRONTEND_ORIGINS` ya tienen valores iniciales en `render.yaml`, incluidos Firebase Hosting y GitHub Pages (`https://tecnologias-2026-2.github.io`). En `FRONTEND_ORIGINS` se configura el origen solamente, sin la ruta `/ProTasker/`. Ajusta la variable si publicas el frontend en otro dominio.
5. Comprueba que `https://protasker-api.onrender.com/health` responda `{"status":"ok"}`. Si cambias el nombre del servicio, actualiza `scripts/api-config.js` con su URL pública más `/api`.
6. Publica las reglas actualizadas de Firestore con `firebase deploy --only firestore:rules --project protaskerhtml`. El `--dry-run` usado durante el desarrollo solo verifica la compilación; no publica cambios.

### Ejecutar localmente

1. Instala Node.js 20 o superior.
2. Desde `backend/`, ejecuta `npm install` y copia `.env.example` a `.env`.
3. Completa las variables de Firebase Admin en `.env`; nunca uses una clave privada real en el frontend.
4. Ejecuta `npm start` desde `backend/`. Para desarrollo local, cambia temporalmente `scripts/api-config.js` a `http://localhost:3000/api` y sirve el frontend en `http://localhost:5500` con Live Server.
5. Ejecuta `npm test` desde `backend/` para validar las reglas de entrada de la API.

## 9. Instalación del frontend

1. Clonar el repositorio o descargar los archivos del proyecto.
2. Sirve la carpeta con una extensión como Live Server en Visual Studio Code; la autenticación y las solicitudes API necesitan un origen web.
3. Inicia sesión o crea una cuenta de Firebase Authentication.
4. Crea tareas desde **Mis tareas** para probar el calendario, las urgencias, el progreso y el modo enfoque.

El frontend no requiere compilación. Para acceder a datos reales, la API de Render y Firebase deben estar configurados.