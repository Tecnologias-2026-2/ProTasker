(function () {
  let app = null;
  let auth = null;
  let database = null;
  let initializationError = null;
  const config = window.PROTASKER_FIREBASE_CONFIG;

  function isConfigured() {
    return config &&
      typeof config.apiKey === "string" && config.apiKey &&
      typeof config.authDomain === "string" && config.authDomain &&
      typeof config.projectId === "string" && config.projectId &&
      typeof config.appId === "string" && config.appId &&
      !Object.values(config).some((value) => typeof value === "string" && value.startsWith("YOUR_"));
  }

  if (isConfigured()) {
    try {
      app = firebase.initializeApp(config);
      auth = firebase.auth(app);
      database = firebase.firestore(app);
    } catch (error) {
      initializationError = error;
    }
  }

  function ensureReady() {
    if (initializationError) {
      throw initializationError;
    }
    if (!auth || !database) {
      const error = new Error("Configura Firebase en scripts/firebase-config.js antes de usar la aplicación.");
      error.code = "app/not-configured";
      throw error;
    }
  }

  function errorMessage(error) {
    if (error?.code === "app/not-configured") {
      return error.message;
    }
    const messages = {
      "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
      "auth/invalid-email": "El correo electrónico no es válido.",
      "auth/invalid-credential": "El correo o la contraseña son incorrectos.",
      "auth/user-not-found": "No existe una cuenta con ese correo.",
      "auth/wrong-password": "El correo o la contraseña son incorrectos.",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
      "auth/too-many-requests": "Hubo demasiados intentos. Espera un momento e inténtalo de nuevo.",
      "auth/network-request-failed": "No se pudo conectar con Firebase. Revisa tu conexión.",
      "auth/unauthorized-domain": "Autoriza el dominio de esta página en Firebase Console: Authentication → Settings → Authorized domains. Añádelo sin protocolo ni puerto (por ejemplo, localhost o 127.0.0.1).",
      "auth/operation-not-allowed": "El proveedor elegido está desactivado. Actívalo en Firebase Console: Authentication → Sign-in method.",
      "auth/admin-restricted-operation": "Firebase no permite esta operación. Activa el proveedor de acceso correspondiente en Authentication → Sign-in method.",
      "auth/configuration-not-found": "No se encontró la configuración de autenticación. Revisa que el proveedor de acceso esté habilitado en Firebase Console.",
      "auth/popup-blocked": "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes para este sitio e inténtalo de nuevo.",
      "auth/popup-closed-by-user": "Se cerró la ventana de Google antes de terminar el inicio de sesión.",
      "auth/cancelled-popup-request": "Ya hay una ventana de inicio de sesión abierta. Termínala antes de iniciar otra.",
      "auth/operation-not-supported-in-this-environment": "Este navegador no admite el inicio de sesión de Google. Abre ProTasker directamente en Chrome o Edge, fuera de la vista integrada de VS Code.",
      "auth/web-storage-unsupported": "El navegador bloqueó el almacenamiento necesario para iniciar sesión. Abre ProTasker en Chrome o Edge y permite cookies y almacenamiento del sitio.",
      "auth/account-exists-with-different-credential": "Ya existe una cuenta con ese correo. Inicia sesión con el método que usaste al registrarte.",
      "auth/credential-already-in-use": "Esta cuenta de Google ya está vinculada a otro usuario.",
      "auth/invalid-api-key": "La API key de Firebase no es válida. Revisa scripts/firebase-config.js y las restricciones de la clave en Google Cloud.",
      "auth/app-not-authorized": "Esta aplicación web no está autorizada para usar Firebase Authentication. Revisa la configuración del proyecto y la API key.",
      "permission-denied": "Firebase rechazó el acceso. Revisa las reglas de Firestore.",
      "firestore/permission-denied": "Firebase rechazó el acceso. Revisa las reglas de Firestore.",
      "unavailable": "Firestore no está disponible. Revisa tu conexión e inténtalo de nuevo.",
      "firestore/unavailable": "Firestore no está disponible. Revisa tu conexión e inténtalo de nuevo."
    };
    const code = typeof error?.code === "string" ? ` (código: ${error.code})` : "";
    return `${messages[error?.code] || "Ocurrió un error al comunicarse con Firebase. Revisa la configuración del proyecto y la consola del navegador."}${code}`;
  }

  function tasksCollection(uid) {
    ensureReady();
    return database.collection("users").doc(uid).collection("tasks");
  }

  window.ProTasker = window.ProTasker || {};
  window.ProTasker.firebase = {
    createAccount(email, password, name) {
      ensureReady();
      return auth.createUserWithEmailAndPassword(email, password)
        .then(({ user }) => user.updateProfile({ displayName: name }).then(() => user));
    },
    signIn(email, password) {
      ensureReady();
      return auth.signInWithEmailAndPassword(email, password).then(({ user }) => user);
    },
    signInWithGoogle() {
      ensureReady();
      const provider = new firebase.auth.GoogleAuthProvider();
      return auth.signInWithPopup(provider)
        .then(({ user }) => user)
        .catch((error) => {
          if (error.code === "auth/operation-not-supported-in-this-environment" ||
            error.code === "auth/popup-blocked") {
            return auth.signInWithRedirect(provider);
          }
          throw error;
        });
    },
    signOut() {
      ensureReady();
      return auth.signOut();
    },
    onAuthStateChanged(callback) {
      if (!auth) {
        callback(null);
        return () => {};
      }
      return auth.onAuthStateChanged(callback);
    },
    subscribeTasks(uid, onTasks, onError) {
      return tasksCollection(uid).onSnapshot((snapshot) => {
        onTasks(snapshot.docs.map((document) => ({ ...document.data(), id: document.id })));
      }, onError);
    },
    saveTask(uid, task) {
      return tasksCollection(uid).doc(task.id).set(task);
    },
    deleteTask(uid, taskId) {
      return tasksCollection(uid).doc(taskId).delete();
    },
    errorMessage
  };
})();
