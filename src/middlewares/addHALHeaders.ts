import { NextFunction, Request, Response } from 'express';

const halMiddleware = () => (
  /**
   * Express middleware
   *
   * @remarks
   * This method is part of the express.
   *
   * @param x - The first input number
   * @param y - The second input number
   * @returns The arithmetic mean of `x` and `y`
   *
   * @beta
   */
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader('content-type', 'application/hal+json; charset=utf-8');
  next();
};
export default halMiddleware;
