export default class CommonResponse {
  code: number;
  message: string;
  data: object | null;
  errors: object | null;

  constructor(
    code: number,
    message: string,
    data: object | null = null,
    errors: object | null = null
  ) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success(
    code: number = 200,
    data: object | null = null,
    message: string = "Success"
  ): CommonResponse {
    return new CommonResponse(code, message, data, null);
  }

  static error(
    code: number = 500,
    message: string = "Error",
    errors: object | null = null
  ): CommonResponse {
    return new CommonResponse(code, message, null, errors);
  }
}
