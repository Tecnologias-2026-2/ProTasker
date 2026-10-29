(function () {
  function initApp() {
    const firebase = window.ProTasker.firebase;
    const siteHeader = document.querySelector(".site-header");
    const landing = document.querySelector(".landing");
    const authView = document.querySelector(".auth-view");
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
    const googleButton = document.querySelector("[data-google-sign-in]");
    const emailField = document.querySelector("#email");
    const passwordField = document.querySelector("#password");
    let isRegistering = false;
    let authOpener = null;
    const dashboard = window.ProTasker.initDashboard(() => firebase.signOut());

    function showAuth(register = false, opener = null) {
      if (opener) {
        authOpener = opener;
      }
      isRegistering = register;
      siteHeader.hidden = true;
      landing.hidden = true;
      dashboardView.hidden = true;
      authView.hidden = false;
      authTitle.textContent = register ? "Crear cuenta" : "Iniciar sesión";
      authIntro.textContent = register ? "Completa los datos para registrarte" : "Ingresa tus datos para continuar";
      nameField.hidden = !register;
      nameField.required = register;
      nameLabel.hidden = !register;
      passwordField.autocomplete = register ? "new-password" : "current-password";
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
      dashboardView.hidden = true;
      landing.hidden = false;
      dashboard.clearSession();
      focusTarget?.focus();
    }

    function showDashboard(user) {
      siteHeader.hidden = true;
      landing.hidden = true;
      authView.hidden = true;
      dashboardView.hidden = false;
      dashboard.prepare(user);
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

    authForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formMessage.hidden = true;
      formMessage.textContent = "";
      submitLabel.disabled = true;

      try {
        const email = emailField.value.trim();
        if (isRegistering && !nameField.value.trim()) {
          formMessage.textContent = "Escribe tu nombre para crear la cuenta.";
          formMessage.hidden = false;
          return;
        }
        if (isRegistering) {
          await firebase.createAccount(email, passwordField.value, nameField.value.trim());
        } else {
          await firebase.signIn(email, passwordField.value);
        }
        authForm.reset();
      } catch (error) {
        formMessage.textContent = firebase.errorMessage(error);
        formMessage.hidden = false;
      } finally {
        submitLabel.disabled = false;
      }
    });

    googleButton.addEventListener("click", async () => {
      formMessage.hidden = true;
      formMessage.textContent = "";
      googleButton.disabled = true;
      try {
        await firebase.signInWithGoogle();
      } catch (error) {
        formMessage.textContent = firebase.errorMessage(error);
        formMessage.hidden = false;
      } finally {
        googleButton.disabled = false;
      }
    });

    firebase.onAuthStateChanged((user) => {
      if (user) {
        showDashboard(user);
      } else {
        showLanding();
      }
    });
  }

  initApp();
})();
