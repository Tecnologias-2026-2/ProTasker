import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../app.js";

test("health endpoint works and private routes reject missing tokens", async (context) => {
  const previousOrigins = process.env.FRONTEND_ORIGINS;
  process.env.FRONTEND_ORIGINS = "https://custom.example";
  const server = createApp().listen(0, "127.0.0.1");
  if (previousOrigins === undefined) {
    delete process.env.FRONTEND_ORIGINS;
  } else {
    process.env.FRONTEND_ORIGINS = previousOrigins;
  }
  await once(server, "listening");
  context.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const healthResponse = await fetch(`${baseUrl}/health`);
  assert.equal(healthResponse.status, 200);
  assert.deepEqual(await healthResponse.json(), { status: "ok" });

  const tasksResponse = await fetch(`${baseUrl}/api/tasks`, {
    headers: { Origin: "http://localhost:5500" }
  });
  assert.equal(tasksResponse.status, 401);
  assert.equal(tasksResponse.headers.get("access-control-allow-origin"), "http://localhost:5500");
  assert.deepEqual(await tasksResponse.json(), {
    error: { code: "api/auth-required", message: "Inicia sesión para continuar." }
  });

  const rejectedOriginResponse = await fetch(`${baseUrl}/api/tasks`, {
    headers: { Origin: "https://untrusted.example" }
  });
  assert.equal(rejectedOriginResponse.status, 403);

  const githubPagesResponse = await fetch(`${baseUrl}/api/tasks`, {
    headers: { Origin: "https://tecnologias-2026-2.github.io" }
  });
  assert.equal(githubPagesResponse.status, 401);
  assert.equal(
    githubPagesResponse.headers.get("access-control-allow-origin"),
    "https://tecnologias-2026-2.github.io"
  );

  const customOriginResponse = await fetch(`${baseUrl}/api/tasks`, {
    headers: { Origin: "https://custom.example" }
  });
  assert.equal(customOriginResponse.status, 401);
  assert.equal(
    customOriginResponse.headers.get("access-control-allow-origin"),
    "https://custom.example"
  );
});
