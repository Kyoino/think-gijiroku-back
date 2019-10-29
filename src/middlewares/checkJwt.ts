import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const checkJwt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  //Get the jwt token from the head
  const bearerTokens = (req.headers['authorization'] as string).split(' ');
  if (bearerTokens[0].toLowerCase() !== 'bearer') {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send('Invalid token2');
    next();
  }
  const token = bearerTokens[1];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwtPayload = jwt.verify(token, config.jwtSecret) as any;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send('Invalid token');
    next();
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { id, firstName, lastName } = jwtPayload;
  const newToken = jwt.sign({ id, firstName, lastName }, config.jwtSecret, {
    expiresIn: '1h',
  });
  res.setHeader('token', newToken);

  //Call the next middleware or controller
  next();
};
