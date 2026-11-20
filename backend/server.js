import "dotenv/config";
import { createApp } from "./app.js";
import { initializeFirebase } from "./database/firebase.js";

const port = Number(process.env.PORT) || 3000;

initializeFirebase();
createApp().listen(port, "0.0.0.0", () => {
  console.log(`ProTasker API escuchando en el puerto ${port}.`);
});
