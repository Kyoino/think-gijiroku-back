import { NextFunction, Response, Request, Router } from 'express';
import users from './users';
import notes from './notes';
import auth from './auth';

const routes = Router();

routes.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: 'test',
  });
  next();
});

// all other routes
routes.use('/users', users);
routes.use('/notes', notes);
routes.use('/auth', auth);
export default routes;
