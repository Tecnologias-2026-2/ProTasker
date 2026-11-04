(function () {
  const calendarApi = "https://www.googleapis.com/calendar/v3";
  const calendarScope = "https://www.googleapis.com/auth/calendar.events";
  const emailScope = "https://www.googleapis.com/auth/userinfo.email";

  function initCalendarSync() {
    const syncButton = document.querySelector("[data-calendar-sync]");
    const intro = document.querySelector("[data-calendar-sync-intro]");
    const status = document.querySelector("[data-calendar-sync-status]");
    let userId = null;
    let tasks = [];
    let tasksLoaded = false;
    let accessToken = null;
    let tokenExpiresAt = 0;
    let isSyncing = false;
    let lastSyncSignature = "";
    let queuedSync = Promise.resolve();

    function setStatus(message, isError = false) {
      status.textContent = message;
      status.classList.toggle("is-error", isError);
      status.hidden = !message;
    }

    function hasValidToken() {
      return accessToken && Date.now() < tokenExpiresAt;
    }

    function calendarClientId() {
      const clientId = window.PROTASKER_GOOGLE_CALENDAR_CLIENT_ID;
      return typeof clientId === "string" && clientId && !clientId.startsWith("YOUR_")
        ? clientId
        : "";
    }

    function signatureFor(taskList) {
      return JSON.stringify([...taskList]
        .sort((first, second) => first.id.localeCompare(second.id))
        .map((task) => [task.id, task.title, task.description, task.date, task.time, task.priority, task.completed]));
    }

    function handleApiError(response, payload) {
      const error = new Error(payload?.error?.message || `Google Calendar respondió con el código ${response.status}.`);
      error.status = response.status;
      return error;
    }

    async function requestCalendarApi(path, method = "GET", body, token = accessToken) {
      const response = await fetch(`${calendarApi}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {})
        },
        ...(body ? { body: JSON.stringify(body) } : {})
      });
      if (!response.ok) {
        const payload = response.status === 204 ? null : await response.json().catch(() => null);
        throw handleApiError(response, payload);
      }
      return response.status === 204 ? null : response.json();
    }

    function taskEvent(task) {
      const start = new Date(`${task.date}T${task.time}:00`);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const priority = task.priority === "high" ? "alta" : task.priority === "low" ? "baja" : "media";
      const description = [
        task.description,
        `Prioridad ${priority}`,
        task.completed ? "Estado: completada" : "Estado: pendiente",
        "Creada desde ProTasker."
      ].filter(Boolean).join("\n\n");
      return {
        summary: task.title,
        description,
        start: { dateTime: start.toISOString(), timeZone },
        end: { dateTime: end.toISOString(), timeZone },
        extendedProperties: {
          private: {
            protasker: "true",
            protaskerTaskId: task.id
          }
        }
      };
    }

    async function removeEvent(eventId, token) {
      try {
        await requestCalendarApi(`/calendars/primary/events/${encodeURIComponent(eventId)}`, "DELETE", null, token);
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
    }

    async function reconcileTasks(taskList, requestedUserId, requestedToken) {
      const savedEvents = await window.ProTasker.firebase.listCalendarEvents(requestedUserId);
      const eventsByTask = new Map(savedEvents.map((item) => [item.taskId, item.eventId]));
      const currentTaskIds = new Set(taskList.map((task) => task.id));

      for (const [taskId, eventId] of eventsByTask) {
        if (!currentTaskIds.has(taskId)) {
          await removeEvent(eventId, requestedToken);
          await window.ProTasker.firebase.deleteCalendarEvent(requestedUserId, taskId);
          eventsByTask.delete(taskId);
        }
      }

      for (const task of taskList) {
        const eventId = eventsByTask.get(task.id);
        if (eventId) {
          try {
            await requestCalendarApi(`/calendars/primary/events/${encodeURIComponent(eventId)}`, "PATCH", taskEvent(task), requestedToken);
            continue;
          } catch (error) {
            if (error.status !== 404) {
              throw error;
            }
          }
        }
        const createdEvent = await requestCalendarApi("/calendars/primary/events", "POST", taskEvent(task), requestedToken);
        if (!createdEvent.id) {
          throw new Error("Google Calendar no devolvió el identificador del evento creado.");
        }
        await window.ProTasker.firebase.saveCalendarEvent(requestedUserId, task.id, createdEvent.id);
      }
    }

    function enqueueSync(taskList, force = false) {
      const requestedUserId = userId;
      const requestedToken = accessToken;
      const requestedSignature = signatureFor(taskList);
      const runSync = async () => {
        if (requestedUserId !== userId || requestedToken !== accessToken) {
          return;
        }
        if (!force && requestedSignature === lastSyncSignature) {
          return;
        }
        isSyncing = true;
        syncButton.disabled = true;
        setStatus("Sincronizando tareas con el calendario principal de Google…");
        try {
          await reconcileTasks(taskList, requestedUserId, requestedToken);
          if (requestedUserId !== userId || requestedToken !== accessToken) {
            return;
          }
          lastSyncSignature = requestedSignature;
          setStatus(`Se sincronizaron ${taskList.length} ${taskList.length === 1 ? "tarea" : "tareas"} con Google Calendar. Los cambios se actualizarán automáticamente mientras la autorización siga vigente.`);
        } catch (error) {
          if (requestedUserId !== userId || requestedToken !== accessToken) {
            throw error;
          }
          if (error.status === 401) {
            accessToken = null;
            tokenExpiresAt = 0;
            syncButton.textContent = "Conectar Google Calendar";
            setStatus("La autorización de Google venció. Vuelve a pulsar «Conectar Google Calendar» para sincronizar los cambios.", true);
          } else {
            setStatus(`No se pudo completar la sincronización con Google Calendar. ${error.message}`, true);
          }
          throw error;
        } finally {
          if (requestedUserId === userId) {
            isSyncing = false;
            syncButton.disabled = !tasksLoaded;
          }
        }
      };
      queuedSync = queuedSync.then(runSync, runSync);
      return queuedSync;
    }

    function autoSync() {
      if (!hasValidToken() || !tasksLoaded) {
        if (accessToken && !hasValidToken()) {
          syncButton.textContent = "Conectar Google Calendar";
          setStatus("La autorización de Google venció. Vuelve a pulsar «Conectar Google Calendar» para sincronizar los cambios.");
        }
        return;
      }
      enqueueSync(tasks).catch((error) => console.error("Error al sincronizar con Google Calendar:", error));
    }

    function requestAccessToken() {
      return new Promise((resolve, reject) => {
        if (window.location.protocol === "file:") {
          reject(new Error("No abras index.html directamente. Usa la página publicada en GitHub Pages o inicia un servidor local como Live Server."));
          return;
        }
        const clientId = calendarClientId();
        if (!clientId) {
          reject(new Error("Configura PROTASKER_GOOGLE_CALENDAR_CLIENT_ID en scripts/firebase-config.js y habilita Google Calendar API."));
          return;
        }
        if (!window.google?.accounts?.oauth2) {
          reject(new Error("No se pudo cargar el servicio de autorización de Google. Revisa tu conexión y vuelve a intentarlo."));
          return;
        }
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: `${calendarScope} ${emailScope}`,
          callback: (response) => {
            if (response.error) {
              reject(new Error(response.error_description || "No se autorizó el acceso a Google Calendar."));
              return;
            }
            accessToken = response.access_token;
            tokenExpiresAt = Date.now() + Number(response.expires_in || 3600) * 1000 - 60_000;
            resolve();
          },
          error_callback: (error) => {
            if (error.type === "popup_closed") {
              reject(new Error("Google cerró la ventana antes de devolver el permiso. En Google Cloud, agrega el origen de tu sitio (por ejemplo, https://tu-usuario.github.io) a los orígenes autorizados del cliente OAuth; no incluyas la ruta del repositorio. También puedes probar sin bloqueadores de ventanas emergentes."));
              return;
            }
            if (error.type === "popup_failed_to_open") {
              reject(new Error("El navegador bloqueó la ventana de Google. Permite las ventanas emergentes para este sitio y vuelve a intentarlo."));
              return;
            }
            reject(new Error(error.message || "No se pudo abrir la ventana de autorización de Google."));
          }
        });
        tokenClient.requestAccessToken({ prompt: "select_account" });
      });
    }

    async function verifyCalendarAccount() {
      const requestedUserId = userId;
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) {
        throw new Error("No se pudo identificar la cuenta de Google autorizada.");
      }
      const profile = await response.json();
      if (!profile.email) {
        throw new Error("Google no devolvió el correo de la cuenta autorizada.");
      }
      const linkedEmail = await window.ProTasker.firebase.getCalendarAccount(requestedUserId);
      if (requestedUserId !== userId) {
        throw new Error("La sesión de ProTasker cambió durante la autorización. Vuelve a intentarlo.");
      }
      if (linkedEmail && linkedEmail.toLocaleLowerCase("en") !== profile.email.toLocaleLowerCase("en")) {
        throw new Error(`Esta cuenta de ProTasker ya está vinculada a ${linkedEmail}. Autoriza esa misma cuenta de Google para evitar duplicar eventos.`);
      }
      if (!linkedEmail) {
        await window.ProTasker.firebase.saveCalendarAccount(requestedUserId, profile.email);
      }
    }

    async function syncFromButton() {
      if (!userId || !tasksLoaded || isSyncing) {
        return;
      }
      syncButton.disabled = true;
      try {
        if (!hasValidToken()) {
          setStatus("Solicitando permiso para administrar eventos en tu calendario principal de Google…");
          try {
            await requestAccessToken();
            await verifyCalendarAccount();
          } catch (error) {
            accessToken = null;
            tokenExpiresAt = 0;
            syncButton.textContent = "Conectar Google Calendar";
            setStatus(`No se pudo conectar con Google Calendar. ${error.message}`, true);
            return;
          }
          syncButton.textContent = "Sincronizar ahora";
        }
        try {
          await enqueueSync(tasks, true);
        } catch (error) {
          console.error("Error al sincronizar con Google Calendar:", error);
        }
      } finally {
        syncButton.disabled = !tasksLoaded || isSyncing;
      }
    }

    syncButton.addEventListener("click", () => syncFromButton());

    return {
      setUser(user) {
        userId = user?.uid || null;
        accessToken = null;
        tokenExpiresAt = 0;
        lastSyncSignature = "";
        tasks = [];
        tasksLoaded = false;
        isSyncing = false;
        const usesGoogleSignIn = user?.providerData?.some((provider) => provider.providerId === "google.com");
        intro.textContent = usesGoogleSignIn
          ? "Iniciaste sesión con Google. Conecta Google Calendar cuando quieras para sincronizar tus tareas actuales."
          : "Conecta la cuenta de Google que prefieras para enviar tus tareas a su calendario principal.";
        syncButton.textContent = "Conectar Google Calendar";
        syncButton.disabled = !userId || !tasksLoaded;
        setStatus("");
      },
      setTasks(taskList, loaded = true) {
        tasks = taskList;
        tasksLoaded = loaded;
        syncButton.disabled = !userId || !tasksLoaded || isSyncing;
        autoSync();
      }
    };
  }

  window.ProTasker = window.ProTasker || {};
  window.ProTasker.initCalendarSync = initCalendarSync;
})();
