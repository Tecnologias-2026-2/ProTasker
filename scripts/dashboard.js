(function () {
  function initDashboard(onLogout) {
    const dashboardTitle = document.querySelector("#dashboard-title");
    const dashboardName = document.querySelector("[data-dashboard-name]");
    const dashboardDate = document.querySelector("[data-dashboard-date]");
    const dashboardSidebar = document.querySelector("[data-dashboard-sidebar]");
    const dashboardMenu = document.querySelector("[data-dashboard-menu]");
    const dashboardFeedback = document.querySelector("[data-dashboard-feedback]");
    const navButtons = [...document.querySelectorAll("[data-dashboard-nav]")];
    const dashboardPages = [...document.querySelectorAll("[data-dashboard-page]")];
    const completedValue = document.querySelector("[data-completed-value]");
    const pendingValue = document.querySelector("[data-pending-value]");
    const streakValue = document.querySelector("[data-streak-value]");
    const completedCaption = document.querySelector(".stat-completed .stat-caption");
    const pendingCaption = document.querySelector(".stat-pending .stat-caption");
    let selectedFocusTaskId = null;
    let taskManager;
    const progress = window.ProTasker.initProgress();
    const calendar = window.ProTasker.initCalendar((taskId) => {
      selectedFocusTaskId = taskId;
      renderFocus(taskManager.getTasks());
      navButtons.find((button) => button.dataset.dashboardNav === "Enfoque").click();
    });

    function updateTasks(tasks) {
      updateStats(tasks);
      calendar.render(tasks);
      progress.render(tasks);
      renderFocus(tasks);
    }

    taskManager = window.ProTasker.createTaskManager(updateTasks);

    function renderFocus(tasks) {
      const list = document.querySelector("[data-focus-list]");
      const empty = document.querySelector("[data-focus-empty]");
      const title = document.querySelector("#focus-workspace-title");
      const description = document.querySelector("[data-focus-description]");
      const meta = document.querySelector("[data-focus-meta]");
      const completeButton = document.querySelector("[data-focus-complete]");
      const editButton = document.querySelector("[data-focus-edit]");
      const pendingTasks = tasks.filter((task) => !task.completed)
        .sort((first, second) => `${first.date}T${first.time}`.localeCompare(`${second.date}T${second.time}`));

      if (!pendingTasks.some((task) => task.id === selectedFocusTaskId)) {
        selectedFocusTaskId = pendingTasks[0]?.id || null;
      }
      const selectedTask = pendingTasks.find((task) => task.id === selectedFocusTaskId);
      const options = pendingTasks.map((task) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "focus-task-option";
        button.dataset.focusTask = task.id;
        button.setAttribute("aria-pressed", String(task.id === selectedFocusTaskId));
        const taskName = document.createElement("span");
        taskName.textContent = task.title;
        const due = document.createElement("span");
        due.textContent = `${task.date} · ${task.time}`;
        button.append(taskName, due);
        return button;
      });
      list.replaceChildren(...options);
      empty.hidden = pendingTasks.length > 0;
      if (selectedTask) {
        title.textContent = selectedTask.title;
        description.textContent = selectedTask.description || "Sin descripción. Mantén la atención en esta actividad.";
        meta.textContent = `${selectedTask.date} · ${selectedTask.time} · Prioridad ${selectedTask.priority === "high" ? "alta" : selectedTask.priority === "low" ? "baja" : "media"}`;
      } else {
        title.textContent = "Selecciona una tarea";
        description.textContent = "Tu tarea seleccionada y sus detalles aparecerán aquí.";
        meta.textContent = "";
      }
      completeButton.disabled = !selectedTask;
      editButton.disabled = !selectedTask;
    }

    function getDateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function getCompletionDateKey(timestamp) {
      const completedDate = new Date(timestamp);
      return Number.isNaN(completedDate.getTime()) ? "" : getDateKey(completedDate);
    }

    function updateStats(tasks) {
      const today = getDateKey(new Date());
      const completedToday = tasks.filter((task) => task.completed && getCompletionDateKey(task.completedAt) === today).length;
      const dueToday = tasks.filter((task) => task.date === today).length;
      const pending = tasks.filter((task) => !task.completed).length;
      const completedDates = new Set(tasks
        .filter((task) => task.completed && task.completedAt)
        .map((task) => getCompletionDateKey(task.completedAt)));
      const streakStart = new Date();
      if (!completedDates.has(today)) {
        streakStart.setDate(streakStart.getDate() - 1);
      }
      let streak = 0;
      while (completedDates.has(getDateKey(streakStart))) {
        streak += 1;
        streakStart.setDate(streakStart.getDate() - 1);
      }
      completedValue.textContent = `${completedToday} / ${dueToday}`;
      completedCaption.textContent = completedToday ? "Tareas terminadas hoy" : "Sin tareas completadas hoy";
      pendingValue.textContent = String(pending);
      pendingCaption.textContent = pending === 1 ? "tarea por completar" : "tareas por completar";
      streakValue.textContent = `${streak} ${streak === 1 ? "día" : "días"}`;
    }

    function setMenuOpen(isOpen) {
      dashboardSidebar.classList.toggle("is-open", isOpen);
      dashboardMenu.setAttribute("aria-expanded", String(isOpen));
      dashboardMenu.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    }

    function reset() {
      const homeButton = navButtons.find((button) => button.dataset.dashboardNav === "Inicio");
      navButtons.forEach((button) => {
        const isCurrent = button === homeButton;
        button.classList.toggle("is-current", isCurrent);
        if (isCurrent) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });
      dashboardPages.forEach((page) => {
        page.hidden = page.dataset.dashboardPage !== "Inicio";
      });
      dashboardFeedback.hidden = true;
      dashboardFeedback.textContent = "";
      setMenuOpen(false);
    }

    navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedPage = button.dataset.dashboardNav;
        const hasPage = dashboardPages.some((page) => page.dataset.dashboardPage === selectedPage);
        navButtons.forEach((item) => {
          const isCurrent = item === button;
          item.classList.toggle("is-current", isCurrent);
          if (isCurrent) {
            item.setAttribute("aria-current", "page");
          } else {
            item.removeAttribute("aria-current");
          }
        });
        dashboardPages.forEach((page) => {
          page.hidden = page.dataset.dashboardPage !== selectedPage;
        });
        dashboardFeedback.textContent = hasPage ? "" : `La sección «${selectedPage}» estará disponible próximamente.`;
        dashboardFeedback.hidden = hasPage;
        setMenuOpen(false);
        const targetHeading = hasPage ? dashboardPages.find((page) => page.dataset.dashboardPage === selectedPage).querySelector("h2") : dashboardTitle;
        targetHeading.focus();
      });
    });

    document.querySelector("[data-dashboard-home]").addEventListener("click", (event) => {
      event.preventDefault();
      navButtons.find((button) => button.dataset.dashboardNav === "Inicio").click();
    });

    dashboardMenu.addEventListener("click", () => {
      const isOpen = dashboardMenu.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
      if (!isOpen) {
        dashboardSidebar.querySelector(".dashboard-nav-item").focus();
      }
    });

    dashboardSidebar.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && dashboardSidebar.classList.contains("is-open")) {
        setMenuOpen(false);
        dashboardMenu.focus();
      }
    });

    document.querySelector("[data-logout]").addEventListener("click", async () => {
      try {
        await onLogout();
      } catch (error) {
        dashboardFeedback.textContent = window.ProTasker.firebase.errorMessage(error);
        dashboardFeedback.hidden = false;
      }
    });
    document.querySelector("[data-go-to-calendar]").addEventListener("click", () => {
      navButtons.find((button) => button.dataset.dashboardNav === "Calendario").click();
    });
    document.querySelector("[data-focus-list]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-focus-task]");
      if (button) {
        selectedFocusTaskId = button.dataset.focusTask;
        renderFocus(taskManager.getTasks());
      }
    });
    document.querySelector("[data-focus-complete]").addEventListener("click", () => {
      if (selectedFocusTaskId) {
        taskManager.setCompleted(selectedFocusTaskId, true);
      }
    });
    document.querySelector("[data-focus-edit]").addEventListener("click", (event) => {
      if (selectedFocusTaskId) {
        taskManager.editTask(selectedFocusTaskId, event.currentTarget);
      }
    });

    return {
      prepare(user) {
        const email = user.email || "";
        const displayName = user.displayName?.trim() || email.split("@")[0] || "Estudiante";
        dashboardName.textContent = displayName;
        document.querySelector("[data-account-name]").textContent = displayName;
        document.querySelector("[data-account-initial]").textContent = displayName.charAt(0).toLocaleUpperCase("es");
        dashboardDate.textContent = new Intl.DateTimeFormat("es", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(new Date());
        taskManager.setUser(user.uid);
        reset();
        dashboardTitle.focus();
      },
      clearSession() {
        taskManager.setUser(null);
        reset();
      },
      reset
    };
  }

  window.ProTasker = window.ProTasker || {};
  window.ProTasker.initDashboard = initDashboard;
})();
