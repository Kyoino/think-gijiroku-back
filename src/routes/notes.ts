import { Router } from 'express';
import { checkRole } from '../middlewares/checkRole';
import NoteController from '../controllers/NoteController';

const router = Router();

/// Get all users
router.get('/', [checkRole(['ADMIN', 'NORMAL'])], NoteController.listAll);

/// Get one user
router.get(
  '/:id([0-9]+)',
  [checkRole(['ADMIN', 'NORMAL'])],
  NoteController.getOneById
);

router.post('/', [checkRole(['ADMIN', 'NORMAL'])], NoteController.newNote);

/// Edit one user
router.post(
  '/:id([0-9]+)',
  [checkRole(['ADMIN', 'NORMAL'])],
  NoteController.editNote
);

/// Delete one user
router.delete(
  '/:id([0-9]+)',
  [checkRole(['ADMIN', 'NORMAL'])],
  NoteController.deleteNote
);

export default router;
