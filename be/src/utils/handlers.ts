import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

export const wrapRequestHandler = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const getBangkokTime = () => {
  // Create a date object for the current time
  const now = new Date();
  // Convert to UTC + 7 hours for Bangkok time
  const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return bangkokTime;
};
