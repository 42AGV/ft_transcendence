import { ResponseError } from '../generated';

export const handleRequestError = (
  error: unknown,
  msg: string,
  logger: (arg0: any) => void = console.error,
) => {
  let errMessage = msg;
  if (error instanceof ResponseError) {
    error.response.json().then((responseBody) => {
      if (responseBody.message) {
        errMessage = responseBody.message;
      } else {
        errMessage = error.response.statusText;
      }
    });
  } else if (error instanceof Error) {
    errMessage = error.message;
  }
  logger(errMessage);
};
