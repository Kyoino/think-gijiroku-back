import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../entity/User';
import { Note } from '../entity/Note';

class NoteController {
  static listAll = async (req: Request, res: Response): Promise<Response> => {
    //Get users from database
    const noteRepository = getRepository(Note);
    try {
      const notes = await noteRepository.find();
      //Send the users object
      return res.send({ notes: notes });
    } catch (e) {
      return res.status(404).send('notes not found');
    }
  };

  static getOneById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //Get the ID from the url
    const id = req.params.id;

    //Get the user from database
    const noteRepository = getRepository(Note);
    try {
      const note = await noteRepository.findOneOrFail(id);
      return res.send({ note: note });
    } catch (error) {
      return res
        .status(404)
        .send({ error: `Note ${id} not found because ${error}` });
    }
  };

  static newNote = async (req: Request, res: Response): Promise<Response> => {
    //Get parameters from the body
    const { title, text, user } = req.body;
    let note!: Note;
    const userRepository = getRepository(User);
    try {
      const noteUser: User | undefined = await userRepository.findOne(user);
      note = new Note({ title, text, user: noteUser });
    } catch (e) {
      return res.status(400).send('invalid user');
    }

    //Validate if the parameters are ok
    const errors = await validate(note);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    //Try to save. If fails, the name is already in use
    const noteRepository = getRepository(Note);
    try {
      await noteRepository.save(note);
    } catch (e) {
      return res.status(409).send('name already in use');
    }

    //If all ok, send 201 response
    return res.status(201).send({ status: 'OK', note: note });
  };

  static editNote = async (req: Request, res: Response): Promise<Response> => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { title, text, user } = req.body;
    let noteUser: User | undefined;

    //Try to find user on database
    const userRepository = getRepository(User);
    try {
      noteUser = await userRepository.findOne(user);
    } catch (e) {
      return res.status(404).send('Invalid User');
    }
    //Try to find note on database
    const noteRepository = getRepository(Note);
    let note;

    try {
      note = await noteRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      return res.status(404).send('Note to edit not found');
    }

    //Validate the new values on model
    note.update({ title, text, user: noteUser });
    const errors = await validate(note);
    if (errors.length > 0) {
      return res.status(400).send({ error: errors });
    }

    //Try to safe, if fails, that means name already in use
    try {
      await noteRepository.save(note);
    } catch (e) {
      return res.status(409).send({ error: e });
    }
    //After all send a 204 (no content, but accepted) response
    return res.status(204).send({ status: 'OK', note: note });
  };

  static deleteNote = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //Get the ID from the url
    const id = req.params.id;

    const noteRepository = getRepository(Note);
    let note!: Note;
    try {
      note = await noteRepository.findOneOrFail(id);
    } catch (error) {
      return res.status(404).send('Note to delete not found');
    }
    await noteRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    return res.status(204).send({ status: 'OK', note: note });
  };
}

export default NoteController;
