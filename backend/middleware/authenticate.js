import { getFirebaseAuth } from "../database/firebase.js";

const invalidTokenCodes = new Set([
  "auth/argument-error",
  "auth/id-token-expired",
  "auth/id-token-revoked",
  "auth/invalid-id-token",
  "auth/invalid-argument",
  "auth/user-disabled"
]);

export async function authenticate(request, response, next) {
  const authorization = request.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    response.status(401).json({
      error: { code: "api/auth-required", message: "Inicia sesión para continuar." }
    });
    return;
  }

  try {
    request.user = await getFirebaseAuth().verifyIdToken(match[1]);
    next();
  } catch (error) {
    if (invalidTokenCodes.has(error.code)) {
      response.status(401).json({
        error: { code: "api/auth-invalid-token", message: "La sesión no es válida. Inicia sesión de nuevo." }
      });
      return;
    }
    next(error);
  }
}
