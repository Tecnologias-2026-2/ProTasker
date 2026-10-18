(function () {
  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getCompletionDateKey(timestamp) {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? "" : getDateKey(date);
  }

  function initProgress() {
    const completedValue = document.querySelector("[data-weekly-completed]");
    const pendingValue = document.querySelector("[data-weekly-pending]");
    const rateValue = document.querySelector("[data-weekly-rate]");
    const chart = document.querySelector("[data-weekly-chart]");

    function render(tasks) {
      const today = new Date();
      const todayKey = getDateKey(today);
      const days = [];
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
        const key = getDateKey(date);
        const completed = tasks.filter((task) => task.completedAt && getCompletionDateKey(task.completedAt) === key).length;
        days.push({
          key,
          date,
          completed,
          label: new Intl.DateTimeFormat("es", { weekday: "short" }).format(date).replace(".", "")
        });
      }
      const weekKeys = new Set(days.map((day) => day.key));
      const weeklyCompleted = tasks.filter((task) => task.completedAt && weekKeys.has(getCompletionDateKey(task.completedAt))).length;
      const pending = tasks.filter((task) => !task.completed).length;
      const dueTasks = tasks.filter((task) => task.date < todayKey);
      const completedDue = dueTasks.filter((task) => task.completed).length;
      const completionRate = dueTasks.length ? Math.round((completedDue / dueTasks.length) * 100) : 0;
      const maximum = Math.max(1, ...days.map((day) => day.completed));
      completedValue.textContent = String(weeklyCompleted);
      pendingValue.textContent = String(pending);
      rateValue.textContent = `${completionRate}%`;

      const bars = days.map((day) => {
        const wrapper = document.createElement("div");
        wrapper.className = "weekly-chart-day";
        const value = document.createElement("span");
        value.className = "weekly-chart-value";
        value.textContent = String(day.completed);
        const track = document.createElement("div");
        track.className = "weekly-chart-track";
        track.setAttribute("aria-hidden", "true");
        const bar = document.createElement("span");
        bar.className = "weekly-chart-bar";
        bar.style.height = `${day.completed ? Math.max(12, day.completed / maximum * 100) : 0}%`;
        track.append(bar);
        const label = document.createElement("span");
        label.className = "weekly-chart-label";
        label.textContent = day.label;
        const dateLabel = document.createElement("span");
        dateLabel.className = "visually-hidden";
        dateLabel.textContent = `${new Intl.DateTimeFormat("es", { day: "numeric", month: "long" }).format(day.date)}: ${day.completed} ${day.completed === 1 ? "tarea completada" : "tareas completadas"}${day.key === todayKey ? ", hoy" : ""}`;
        wrapper.setAttribute("aria-label", dateLabel.textContent);
        wrapper.append(value, track, label, dateLabel);
        return wrapper;
      });
      chart.replaceChildren(...bars);
    }

    return { render };
  }

  window.ProTasker = window.ProTasker || {};
  window.ProTasker.initProgress = initProgress;
})();
