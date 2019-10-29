import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../entity/User';
import config from '../config/config';
import toHash from '../utils/to_hash';

class AuthController {
  static login = async (req: Request, res: Response): Promise<Response> => {
    //Check if username and password are set
    const { firstName, lastName, password } = req.body;
    if (!(firstName && lastName && password)) {
      return res.status(400).send({ status: 'Invalid USER OBJECT' });
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user!: User | undefined;
    try {
      user = await userRepository
        .createQueryBuilder('User')
        .addSelect('User.password')
        .where({ firstName: firstName, lastName: lastName })
        .getOne();
    } catch (error) {
      return res.status(401).send('user not ');
    }

    if (user === undefined) {
      return res.status(404).send();
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(401).send();
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { id: user.id, firstName: user.firstName, lastName: user.lastName },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    //Send the jwt in the response
    return res.send({ token: token });
  };

  static changePassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.id;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      return res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user!: User | undefined;
    try {
      user = await userRepository
        .createQueryBuilder('User')
        .addSelect('User.password')
        .where(id)
        .getOne();
    } catch (id) {
      return res.status(401).send();
    }
    if (user === undefined) {
      return res.status(404).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      return res.status(401).send();
    }

    //Validate de model (password length)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    //Hash the new password and save
    user.password = toHash(user.password);
    await userRepository.save(user);

    return res.status(204).send();
  };
}

export default AuthController;
