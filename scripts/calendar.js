(function () {
  function dateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function initCalendar(onTaskSelect) {
    const monthHeading = document.querySelector("[data-calendar-month]");
    const daysContainer = document.querySelector("[data-calendar-days]");
    const eventsContainer = document.querySelector("[data-calendar-events]");
    const selectedDateHeading = document.querySelector("[data-calendar-selected-date]");
    const emptyState = document.querySelector("[data-calendar-empty]");
    const today = new Date();
    let month = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
    let tasks = [];

    function formatSelectedDate(value) {
      const [year, monthNumber, day] = value.split("-").map(Number);
      return new Intl.DateTimeFormat("es", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(year, monthNumber - 1, day));
    }

    function renderEvents() {
      const selectedTasks = tasks
        .filter((task) => task.date === selectedDate)
        .sort((first, second) => first.time.localeCompare(second.time));
      selectedDateHeading.textContent = `Tareas del ${formatSelectedDate(selectedDate)}`;
      const cards = selectedTasks.map((task) => {
        const item = document.createElement("article");
        item.className = `calendar-event${task.completed ? " is-completed" : ""}`;
        const title = document.createElement("h4");
        title.textContent = task.title;
        const details = document.createElement("p");
        details.textContent = `${task.time} · Prioridad ${task.priority === "high" ? "alta" : task.priority === "low" ? "baja" : "media"}${task.completed ? " · Completada" : ""}`;
        const select = document.createElement("button");
        select.className = "task-action";
        select.type = "button";
        select.textContent = "Ver en modo enfoque";
        select.disabled = task.completed;
        select.dataset.calendarTask = task.id;
        select.setAttribute("aria-label", `Ver ${task.title} en modo enfoque`);
        item.append(title, details, select);
        return item;
      });
      eventsContainer.replaceChildren(...cards);
      emptyState.hidden = selectedTasks.length > 0;
    }

    function render(tasksToRender = tasks) {
      tasks = tasksToRender;
      monthHeading.textContent = new Intl.DateTimeFormat("es", {
        month: "long",
        year: "numeric"
      }).format(month);
      const year = month.getFullYear();
      const monthIndex = month.getMonth();
      const firstDayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
      const cells = [];
      const cellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

      for (let index = 0; index < cellCount; index += 1) {
        const day = index - firstDayOffset + 1;
        if (day < 1 || day > daysInMonth) {
          const blank = document.createElement("span");
          blank.className = "calendar-day is-outside";
          blank.setAttribute("aria-hidden", "true");
          cells.push(blank);
          continue;
        }

        const key = dateKey(year, monthIndex, day);
        const dayTasks = tasks.filter((task) => task.date === key);
        const button = document.createElement("button");
        button.className = "calendar-day";
        button.type = "button";
        button.dataset.calendarDate = key;
        button.setAttribute("aria-pressed", String(key === selectedDate));
        button.setAttribute("aria-label", `${day} de ${new Intl.DateTimeFormat("es", { month: "long" }).format(month)}${dayTasks.length ? `, ${dayTasks.length} ${dayTasks.length === 1 ? "tarea" : "tareas"}` : ", sin tareas"}${key === todayKey ? ", hoy" : ""}`);
        if (key === todayKey) {
          button.classList.add("is-today");
        }
        if (key === selectedDate) {
          button.classList.add("is-selected");
        }
        const number = document.createElement("span");
        number.textContent = String(day);
        button.append(number);
        if (dayTasks.length) {
          const marker = document.createElement("span");
          marker.className = "calendar-task-count";
          marker.textContent = String(dayTasks.length);
          marker.setAttribute("aria-hidden", "true");
          button.append(marker);
        }
        cells.push(button);
      }
      daysContainer.replaceChildren(...cells);
      renderEvents();
    }

    document.querySelector("[data-calendar-prev]").addEventListener("click", () => {
      month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
      selectedDate = dateKey(month.getFullYear(), month.getMonth(), 1);
      render();
    });
    document.querySelector("[data-calendar-next]").addEventListener("click", () => {
      month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      selectedDate = dateKey(month.getFullYear(), month.getMonth(), 1);
      render();
    });
    document.querySelector("[data-calendar-today]").addEventListener("click", () => {
      month = new Date(today.getFullYear(), today.getMonth(), 1);
      selectedDate = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
      render();
    });
    daysContainer.addEventListener("click", (event) => {
      const dayButton = event.target.closest("[data-calendar-date]");
      if (dayButton) {
        selectedDate = dayButton.dataset.calendarDate;
        render();
        daysContainer.querySelector(`[data-calendar-date="${selectedDate}"]`).focus();
      }
    });
    eventsContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-calendar-task]");
      if (button) {
        onTaskSelect(button.dataset.calendarTask);
      }
    });

    render();
    return { render };
  }

  window.ProTasker = window.ProTasker || {};
  window.ProTasker.initCalendar = initCalendar;
})();
