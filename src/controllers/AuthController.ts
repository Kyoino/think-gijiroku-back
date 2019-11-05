import { Request, response, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../entity/User';
import axios, { AxiosInstance } from 'axios';

// TODO: config file か環境変数から読み込ませる
const AUTH_URI = 'http://gijiroku_express.develop-works.com/';
const getAxiosServer = (baseURL: string): AxiosInstance =>
  axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  });

class AuthController {
  // axios server instance
  static axiosServer = getAxiosServer(AUTH_URI);

  static login = async (req: Request, res: Response): Promise<Response> => {
    //Check if username and password are set
    const { firstName, lastName, password } = req.body;
    if (!(firstName && lastName && password)) {
      return res.status(400).send({ status: 'Invalid USER OBJECT' });
    }

    const response = await AuthController.axiosServer.post('/auth/login', {
      firstName: firstName,
      lastName: lastName,
      password: password,
    });
    const token = response.data.token as string;
    //Get user from database
    const userRepository = getRepository(User);
    let user!: User | undefined;
    try {
      user = await userRepository
        .createQueryBuilder('User')
        .where({ firstName: firstName, lastName: lastName })
        .getOne();
    } catch (error) {
      return res.status(401).send('cannot get user from DB ');
    }
    if (user === undefined) {
      user = new User({ firstName: firstName, lastName: lastName, roles: [] });
      await userRepository.save(user);
      return res.send({ token: token });
    } else {
      return res.send({ token: token });
    }
  };

  static changePassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //Get parameters from the body
    const { id, oldPassword, newPassword } = req.body;
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

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    await userRepository.save(user);

    return res.status(204).send();
  };
}

export default AuthController;
