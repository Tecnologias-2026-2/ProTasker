(function () {
  const featureContent = {
    tasks: {
      title: "Gestión de Tareas",
      copy: "Añade tareas con título, descripción, fecha y hora exactas. Edítalas en cualquier momento, márcalas como completadas o elimínalas. Se ordenan automáticamente por fecha para que nunca pierdas una entrega.",
      icon: "feature-purple"
    },
    calendar: {
      title: "Calendario Visual",
      copy: "Consulta tus actividades en un calendario mensual claro. Identifica entregas y fechas importantes de un vistazo para planificar mejor tu tiempo.",
      icon: "feature-blue"
    },
    notifications: {
      title: "Notificaciones",
      copy: "Recibe alertas del navegador en tiempo real para mantenerte al tanto de tus actividades y de los cambios importantes.",
      icon: "feature-teal"
    },
    reminders: {
      title: "Recordatorios",
      copy: "Configura avisos anticipados para tus tareas y recibe un recordatorio antes de cada entrega, con el tiempo que mejor se ajuste a ti.",
      icon: "feature-violet"
    }
  };

  function initFeatures() {
    const featureButtons = [...document.querySelectorAll("[data-feature]")];
    const featureDetail = document.querySelector("#feature-detail");
    const detailTitle = document.querySelector("[data-detail-title]");
    const detailCopy = document.querySelector("[data-detail-copy]");
    const detailIcon = document.querySelector(".detail-icon");

    featureButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const wasExpanded = button.getAttribute("aria-expanded") === "true";
        featureButtons.forEach((feature) => {
          feature.setAttribute("aria-expanded", "false");
          feature.querySelector("[data-toggle-label]").textContent = "▼ ver más";
        });

        if (wasExpanded) {
          featureDetail.hidden = true;
          return;
        }

        const content = featureContent[button.dataset.feature];
        button.setAttribute("aria-expanded", "true");
        button.querySelector("[data-toggle-label]").textContent = "▲ ocultar";
        detailTitle.textContent = content.title;
        detailCopy.textContent = content.copy;
        detailIcon.className = `detail-icon ${content.icon}`;
        featureDetail.hidden = false;
      });
    });
  }

  window.ProTasker = window.ProTasker || {};
  window.ProTasker.initFeatures = initFeatures;
})();
