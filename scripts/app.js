(function () {
  function initApp() {
    const siteHeader = document.querySelector(".site-header");
    const landing = document.querySelector(".landing");
    const authView = document.querySelector(".auth-view");
    const verificationView = document.querySelector(".verification-view");
    const dashboardView = document.querySelector(".dashboard-view");
    const landingTitle = document.querySelector("#hero-title");
    const authTitle = document.querySelector("[data-auth-title]");
    const authIntro = document.querySelector("[data-auth-intro]");
    const authForm = document.querySelector("[data-auth-form]");
    const nameField = document.querySelector("[data-name-field]");
    const nameLabel = document.querySelector("[data-name-label]");
    const switchCopy = document.querySelector("[data-switch-copy]");
    const switchButton = document.querySelector("[data-switch-auth]");
    const submitLabel = document.querySelector("[data-submit-label]");
    const formMessage = document.querySelector("[data-form-message]");
    const verificationForm = document.querySelector("[data-verification-form]");
    const verificationTitle = document.querySelector("#verification-title");
    const verificationEmail = document.querySelector("[data-verification-email]");
    const verificationCode = document.querySelector("#verification-code");
    const verifyButton = document.querySelector("[data-verify-button]");
    const verificationFeedback = document.querySelector("[data-verification-feedback]");
    const demoVerificationCode = "265378";
    let isRegistering = false;
    let authOpener = null;
    let pendingAccount = null;
    const dashboard = window.ProTasker.initDashboard(() => {
      authForm.reset();
      verificationForm.reset();
      pendingAccount = null;
      isRegistering = false;
      showLanding(landingTitle);
    });

    function showAuth(register = false, opener = null) {
      if (opener) {
        authOpener = opener;
      }
      isRegistering = register;
      siteHeader.hidden = true;
      landing.hidden = true;
      verificationView.hidden = true;
      dashboardView.hidden = true;
      authView.hidden = false;
      authTitle.textContent = register ? "Crear cuenta" : "Iniciar sesión";
      authIntro.textContent = register ? "Completa los datos para registrarte" : "Ingresa tus datos para continuar";
      nameField.hidden = !register;
      nameField.required = register;
      nameLabel.hidden = !register;
      document.querySelector("#password").autocomplete = register ? "new-password" : "current-password";
      switchCopy.textContent = register ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?";
      switchButton.textContent = register ? "Inicia sesión" : "Regístrate gratis";
      submitLabel.firstChild.textContent = register ? "Continuar " : "Iniciar sesión ";
      formMessage.hidden = true;
      formMessage.textContent = "";
      authTitle.focus();
    }

    function showLanding(focusTarget = authOpener) {
      siteHeader.hidden = false;
      authView.hidden = true;
      verificationView.hidden = true;
      dashboardView.hidden = true;
      landing.hidden = false;
      dashboard.reset();
      focusTarget?.focus();
    }

    function showVerification() {
      siteHeader.hidden = true;
      landing.hidden = true;
      authView.hidden = true;
      dashboardView.hidden = true;
      verificationView.hidden = false;
      verificationEmail.textContent = pendingAccount.email;
      verificationCode.value = "";
      verificationCode.removeAttribute("aria-invalid");
      verifyButton.disabled = true;
      verificationFeedback.hidden = true;
      verificationFeedback.textContent = "";
      verificationTitle.focus();
    }

    function showDashboard(name, email) {
      siteHeader.hidden = true;
      landing.hidden = true;
      authView.hidden = true;
      verificationView.hidden = true;
      dashboardView.hidden = false;
      dashboard.prepare(name, email);
    }

    window.ProTasker.initFeatures();

    document.querySelectorAll("[data-open-auth]").forEach((button) => {
      button.addEventListener("click", () => showAuth(button.hasAttribute("data-register-entry"), button));
    });
    switchButton.addEventListener("click", () => showAuth(!isRegistering));
    document.querySelector("[data-back-home]").addEventListener("click", () => showLanding());
    document.querySelectorAll("[data-home-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!authView.hidden) {
          event.preventDefault();
          showLanding(landingTitle);
        }
      });
    });

    authForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (isRegistering) {
        pendingAccount = {
          name: nameField.value.trim(),
          email: document.querySelector("#email").value.trim()
        };
        showVerification();
        return;
      }

      const email = document.querySelector("#email").value.trim();
      const name = email.split("@")[0].replace(/[._-]+/g, " ");
      authForm.reset();
      showDashboard(name, email);
    });

    verificationCode.addEventListener("input", () => {
      verificationCode.value = verificationCode.value.replace(/\D/g, "").slice(0, 6);
      verifyButton.disabled = verificationCode.value.length !== 6;
      verificationCode.removeAttribute("aria-invalid");
      verificationFeedback.hidden = true;
      verificationFeedback.textContent = "";
    });

    verificationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (verificationCode.value !== demoVerificationCode) {
        verificationCode.setAttribute("aria-invalid", "true");
        verificationFeedback.textContent = "El código no es correcto. Revisa el código de demostración e inténtalo de nuevo.";
        verificationFeedback.hidden = false;
        verificationCode.focus();
        return;
      }

      verificationForm.reset();
      authForm.reset();
      showDashboard(pendingAccount.name, pendingAccount.email);
      pendingAccount = null;
    });

    document.querySelector("[data-back-to-register]").addEventListener("click", () => {
      showAuth(true);
      nameField.focus();
    });

    document.querySelector("[data-resend-code]").addEventListener("click", () => {
      verificationFeedback.textContent = `Modo demostración: usa el código ${demoVerificationCode}. No se envió ningún correo.`;
      verificationFeedback.hidden = false;
    });
  }

  initApp();
})();
