import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import { Role } from '../entity/Role';

export const checkRole = (
  roles: Array<Role> | Array<string>
): RequestHandler => {
  // check Role | Array
  const roleTypes: Array<string> = [];
  roles.forEach((item: Role | string) => {
    if (typeof item === 'string') {
      roleTypes.push(item);
    } else {
      roleTypes.push(item.role);
    }
  });
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    //Get the user ID from previous middleware
    const id = res.locals.jwtPayload.id;

    //Get user role from the database
    const userRepository = getRepository(User);
    let user!: User;
    try {
      user = await userRepository.findOneOrFail(id);
      next();
    } catch (id) {
      res.status(401).send('Not found login user id');
    }

    //Check if array of authorized roles includes the user's role
    const userRoles = await getRepository(Role).find({
      relations: ['users'],
      // where: { id: user.id },
    });
    if (userRoles === null || typeof userRoles === 'undefined') {
      res.status(401).send(`Role undefined ${user.roles}`);
      next();
    } else {
      let flag = false;
      userRoles.forEach((userRole: Role) => {
        if (roleTypes.includes(userRole.role)) {
          flag = true;
          console.log('user role accepted');
        }
      });
      if (flag) next();
      else res.status(401).send(`Access not allowed with this role`);
      next();
    }
  };
};
