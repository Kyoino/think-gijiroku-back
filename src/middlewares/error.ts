import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const errorMiddleware = (): ErrorRequestHandler => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  next();
};
export default errorMiddleware;
