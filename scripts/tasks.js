(function () {
  const storagePrefix = "protasker.tasks:";
  const priorities = {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  };

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function createTaskManager(onChange) {
    const dashboard = document.querySelector(".dashboard-view");
    const feedback = document.querySelector("[data-dashboard-feedback]");
    const dialog = document.querySelector("[data-task-dialog]");
    const form = document.querySelector("[data-task-form]");
    const dialogTitle = document.querySelector("[data-task-dialog-title]");
    const taskLists = [
      document.querySelector("[data-today-tasks]"),
      document.querySelector("[data-upcoming-tasks]"),
      document.querySelector("[data-all-tasks]"),
      document.querySelector("[data-urgent-tasks]")
    ];
    const emptyStates = [
      document.querySelector("[data-today-empty]"),
      document.querySelector("[data-upcoming-empty]"),
      document.querySelector("[data-all-empty]"),
      document.querySelector("[data-urgent-empty]")
    ];
    let tasks = [];
    let storageKey = `${storagePrefix}guest`;
    let returnFocus = null;

    function showFeedback(message) {
      feedback.textContent = message;
      feedback.hidden = !message;
    }

    function persist() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        showFeedback("");
        return true;
      } catch {
        showFeedback("No se pudieron guardar los cambios en el almacenamiento de este navegador.");
        return false;
      }
    }

    function isTask(value) {
      return value &&
        typeof value.id === "string" &&
        typeof value.title === "string" &&
        typeof value.description === "string" &&
        typeof value.date === "string" &&
        typeof value.time === "string" &&
        Object.hasOwn(priorities, value.priority) &&
        typeof value.completed === "boolean";
    }

    function load() {
      try {
        const saved = localStorage.getItem(storageKey);
        tasks = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(tasks) || !tasks.every(isTask)) {
          throw new TypeError("El formato de tareas almacenadas no es válido.");
        }
      } catch {
        tasks = [];
        showFeedback("No se pudieron cargar las tareas guardadas. Se mostrará una lista vacía en esta sesión.");
      }
      render();
    }

    function compareTasks(first, second) {
      return `${first.date}T${first.time}`.localeCompare(`${second.date}T${second.time}`);
    }

    function formatDate(value) {
      const [year, month, day] = value.split("-").map(Number);
      return new Intl.DateTimeFormat("es", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(year, month - 1, day));
    }

    function makeAction(label, action, task) {
      const button = document.createElement("button");
      button.className = "task-action";
      button.type = "button";
      button.dataset.taskAction = action;
      button.dataset.taskId = task.id;
      button.textContent = label;
      button.setAttribute("aria-label", `${label} tarea: ${task.title}`);
      return button;
    }

    function createCard(task) {
      const card = document.createElement("article");
      card.className = `task-card${task.completed ? " is-completed" : ""}`;
      card.dataset.taskId = task.id;

      const main = document.createElement("div");
      main.className = "task-card-main";
      const title = document.createElement("h3");
      title.textContent = task.title;
      const description = document.createElement("p");
      description.className = "task-card-description";
      description.textContent = task.description || "Sin descripción";
      main.append(title, description);

      const details = document.createElement("div");
      details.className = "task-card-details";
      const due = document.createElement("span");
      due.textContent = `${formatDate(task.date)} · ${task.time}`;
      const priority = document.createElement("span");
      priority.className = `task-priority priority-${task.priority}`;
      priority.textContent = `Prioridad ${priorities[task.priority].toLowerCase()}`;
      details.append(due, priority);

      const actions = document.createElement("div");
      actions.className = "task-card-actions";
      actions.append(
        makeAction(task.completed ? "Marcar pendiente" : "Completar", "toggle", task),
        makeAction("Editar", "edit", task),
        makeAction("Eliminar", "delete", task)
      );
      card.append(main, details, actions);
      return card;
    }

    function fillList(list, items) {
      list.replaceChildren(...items.map(createCard));
    }

    function render() {
      const today = dateKey(new Date());
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      const urgentLimit = dateKey(dayAfterTomorrow);
      const sorted = [...tasks].sort((first, second) => {
        if (first.completed !== second.completed) {
          return Number(first.completed) - Number(second.completed);
        }
        return compareTasks(first, second);
      });
      const todayTasks = sorted.filter((task) => task.date === today && !task.completed);
      const upcomingTasks = sorted.filter((task) => task.date !== today && !task.completed);
      const urgentTasks = sorted.filter((task) => !task.completed && (task.priority === "high" || task.date <= urgentLimit));
      fillList(taskLists[0], todayTasks);
      fillList(taskLists[1], upcomingTasks);
      fillList(taskLists[2], sorted);
      fillList(taskLists[3], urgentTasks);
      emptyStates[0].hidden = todayTasks.length > 0;
      emptyStates[1].hidden = upcomingTasks.length > 0;
      emptyStates[2].hidden = sorted.length > 0;
      emptyStates[3].hidden = urgentTasks.length > 0;
      onChange(tasks);
    }

    function openForm(task = null, opener = document.activeElement) {
      returnFocus = opener;
      form.reset();
      form.elements.title.setCustomValidity("");
      document.querySelector("[data-task-id]").value = task ? task.id : "";
      dialogTitle.textContent = task ? "Editar tarea" : "Nueva tarea";
      if (task) {
        form.elements.title.value = task.title;
        form.elements.description.value = task.description;
        form.elements.date.value = task.date;
        form.elements.time.value = task.time;
        form.elements.priority.value = task.priority;
      } else {
        const now = new Date();
        form.elements.date.value = dateKey(now);
        form.elements.time.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      }
      dialog.showModal();
      form.elements.title.focus();
    }

    function closeForm() {
      if (dialog.open) {
        dialog.close();
      }
      if (returnFocus?.isConnected) {
        returnFocus.focus();
      } else {
        document.querySelector("#tasks-title").focus();
      }
    }

    function setCompleted(taskId, completed) {
      const task = tasks.find((item) => item.id === taskId);
      if (!task) {
        return false;
      }
      task.completed = completed;
      task.completedAt = completed ? new Date().toISOString() : null;
      persist();
      render();
      return true;
    }

    document.querySelectorAll("[data-create-task]").forEach((button) => {
      button.addEventListener("click", () => openForm(null, button));
    });
    document.querySelectorAll("[data-close-task-dialog]").forEach((button) => {
      button.addEventListener("click", closeForm);
    });

    form.elements.title.addEventListener("input", () => {
      const title = form.elements.title.value;
      form.elements.title.setCustomValidity(title && !title.trim() ? "Escribe un título para la tarea." : "");
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeForm();
      }
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeForm();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }
      if (!form.elements.title.value.trim()) {
        form.elements.title.setCustomValidity("Escribe un título para la tarea.");
        form.elements.title.reportValidity();
        return;
      }
      const id = document.querySelector("[data-task-id]").value;
      const existing = tasks.find((task) => task.id === id);
      const task = {
        id: existing ? existing.id : crypto.randomUUID(),
        title: form.elements.title.value.trim(),
        description: form.elements.description.value.trim(),
        date: form.elements.date.value,
        time: form.elements.time.value,
        priority: form.elements.priority.value,
        completed: existing ? existing.completed : false,
        completedAt: existing ? existing.completedAt : null
      };
      if (existing) {
        tasks = tasks.map((item) => item.id === id ? task : item);
      } else {
        tasks.push(task);
      }
      persist();
      render();
      closeForm();
    });

    dashboard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-task-action]");
      if (!button) {
        return;
      }
      const task = tasks.find((item) => item.id === button.dataset.taskId);
      if (!task) {
        showFeedback("No se encontró la tarea seleccionada. Actualiza la página e inténtalo de nuevo.");
        return;
      }
      const taskAction = button.dataset.taskAction;
      if (button.dataset.taskAction === "edit") {
        openForm(task, button);
        return;
      }
      if (button.dataset.taskAction === "delete") {
        if (!window.confirm(`¿Eliminar la tarea «${task.title}»?`)) {
          return;
        }
        tasks = tasks.filter((item) => item.id !== task.id);
      } else {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
      }
      persist();
      render();
      const nextAction = [...dashboard.querySelectorAll("[data-task-action]")].find((item) => {
        return item.dataset.taskAction === taskAction && item.dataset.taskId === task.id;
      });
      (nextAction || dashboard.querySelector("#dashboard-title")).focus();
    });

    return {
      setUser(email) {
        storageKey = `${storagePrefix}${encodeURIComponent(email.trim().toLowerCase())}`;
        load();
      },
      getTasks() {
        return tasks;
      },
      editTask(taskId, opener) {
        const task = tasks.find((item) => item.id === taskId);
        if (task) {
          openForm(task, opener);
        }
      },
      setCompleted
    };
  }

  window.ProTasker = window.ProTasker || {};
  window.ProTasker.createTaskManager = createTaskManager;
})();
