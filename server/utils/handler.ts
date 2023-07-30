import type { EventHandler, H3Event } from "h3";
import type { IncomingMessage } from "node:http";
import { H3Error } from "h3";

type Request = IncomingMessage & {
  originalUrl: string;
};

const printRequest = (
  method: string,
  path: string,
  statusCode: number,
  time: number
) => {
  console.log(method, path, statusCode, time + "ms");
};

export const defineWrappedResponseHandler = (handler: EventHandler) =>
  defineEventHandler(async (event: H3Event) => {
    const request = event.node.req as Request;
    try {
      const start = Date.now();
      const response = await handler(event);
      const end = Date.now();
      printRequest(
        getMethod(event),
        request.originalUrl,
        getResponseStatus(event),
        end - start
      );
      return response;
    } catch (error) {
      if (error instanceof H3Error) {
        printRequest(getMethod(event), request.originalUrl, error.statusCode);
      } else {
        printRequest(getMethod(event), request.originalUrl, 500);
      }
      throw error;
    }
  });
