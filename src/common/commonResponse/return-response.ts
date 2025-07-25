class ReturnResponse {
  success: boolean;
  message: string;
  data: any;

  constructor(success: boolean, message: string, data: any) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static createFailure(message: string, data?: any) {
    return new ReturnResponse(false, message, data);
  }

  static createSuccess(message: string, data?: any) {
    return new ReturnResponse(true, message, data);
  }
}

export default ReturnResponse;
