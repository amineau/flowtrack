import authService from "@/server/db/service/auth";

const PUBLIC_AUTH_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/session",
];

export default defineEventHandler(async (event) => {
  console.log("auth middleware");
  const path = getRequestPath(event);
  if (
    PUBLIC_AUTH_ROUTES.includes(path) ||
    !path.startsWith("/api") ||
    path.endsWith("/authorize")
  ) {
    return;
  }
  const token = getCookie(event, "auth:token");
  if (!token) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  const user = await authService.getUser(token);
  if (!user) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  event.context.session = { user, token };
});
