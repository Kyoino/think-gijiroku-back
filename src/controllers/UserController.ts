import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../entity/User';

class UserController {
  static listAll = async (req: Request, res: Response): Promise<Response> => {
    //Get users from database
    const userRepository = getRepository(User);
    try {
      const users = await userRepository.find();
      //Send the users object
      return res.send({ users: users });
    } catch (e) {
      return res.status(404).send('users not found');
    }
  };

  static getOneById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //Get the ID from the url
    const id = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id);
      return res.send({ user: user });
    } catch (error) {
      return res.status(404).send(`User ${id} not found because ${error}`);
    }
  };

  static newUser = async (req: Request, res: Response): Promise<Response> => {
    //Get parameters from the body
    const { firstName, lastName, roles } = req.body;
    const user = new User({ firstName, lastName, roles });

    //Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    //Try to save. If fails, the name is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).send('name already in use');
    }

    //If all ok, send 201 response
    return res.status(201).send({ status: 'OK', user: user });
  };

  static editUser = async (req: Request, res: Response): Promise<Response> => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { firstName, lastName, roles, notes } = req.body;

    //Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      return res.status(404).send('User to edit not found');
    }

    //Validate the new values on model
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    //Try to safe, if fails, that means name already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).send('name already in use');
    }
    //After all send a 204 (no content, but accepted) response
    return res.status(204).send({ status: 'OK', user: user });
  };

  static deleteUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user!: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      return res.status(404).send('User to delete not found');
    }
    await userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    return res.status(204).send({ status: 'OK', user: user });
  };
}

export default UserController;
