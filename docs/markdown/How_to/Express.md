# Express
This template use [`Express`](https://expressjs.com/ja/) to create server

If you need to learn about express, google with words like 'express js'.

write about the way to create route and API in this project here.

## Router
In this project, Router is in `src/routes` folder.
if you add `notes` API, create `src/routes/notes.ts` and write like this.

first, create variable of Router.
```typescript
import { Router } from 'express';
// ... other import

const router = Router()
// some method to add endpoint
export default router;
```
Next, add HTTP method like this.

```typescript
router.get(
  // route from Root URI of this router.
  // `(ROOT_URL)/notes/` this time
  '/',
  // middleware to use when this uri accessed 
  [checkJwt, checkRole(['ADMIN', 'NORMAL'])],
  // Function having same structure of RequestHandler
  NoteController.listAll
);
```

When use uri as parameters, you should write as `/:param`
you can restrict like below

```typescript
router.delete(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN', 'NORMAL'])],
  NoteController.deleteNote
);
```

