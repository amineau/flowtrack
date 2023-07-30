import { createRouter, useBase } from "h3";
import authService from "@/server/db/service/auth";
import userService from "@/server/db/service/user";

const router = createRouter();

router.post(
  "/login",
  defineWrappedResponseHandler(async (event) => {
    console.log("/login");
    const body = await readBody(event);
    const { email, password } = body;
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing email or password",
      });
    }
    try {
      const user = await authService.login({ email, password });
      const session = await authService.createSession(user.id);
      return { token: session.token, expiresAt: session.expiresAt };
    } catch (error: any) {
      throw createError({
        statusCode: 403,
        statusMessage: error.message,
      });
    }
  })
);

router.post(
  "/register",
  defineWrappedResponseHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, username } = body;
    if (!email || !password || !username) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing email or password",
      });
    }
    const existingUser = await userService.getByEmail(email);
    if (existingUser) {
      throw createError({
        statusCode: 403,
        statusMessage: "User already exists",
      });
    }
    const user = await authService.register({ email, password, username });
    if (!user) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user",
      });
    }
    return { success: true };
  })
);

router.post(
  "/logout",
  defineWrappedResponseHandler(async (event) => {
    console.log("/logout");
    const token = event.context.session.token;
    await authService.deleteSession(token);
    return { success: true };
  })
);

router.get(
  "/session",
  defineWrappedResponseHandler(async (event) => {
    const authorization = getHeader(event, "Authorization");
    if (!authorization) {
      throw createError({
        statusCode: 403,
        statusMessage: "Missing authorization header",
      });
    }
    const token = authorization.replace(/^Bearer /, "");
    if (!token) {
      throw createError({
        statusCode: 403,
        statusMessage: "Missing token",
      });
    }
    const user = await authService.getUser(token);
    if (!user) {
      throw createError({
        statusCode: 403,
        statusMessage: "Invalid token",
      });
    }
    return { user };
  })
);

export default useBase("/api/auth", router.handler);
