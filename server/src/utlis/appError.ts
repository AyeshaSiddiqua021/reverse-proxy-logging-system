import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}
export class BadRequestError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: BadRequestError
  ) {
    super(message);
  }
}
export class UnauthorizedError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: UnauthorizedError
  ) {
    super(message);
  }
}
export class ProxyLogDisabledError extends Error {
 constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: ProxyLogDisabledError
  ) {
    super(message);
  }
}
