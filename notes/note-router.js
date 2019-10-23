const express = require('express');
const NoteService = require('./note-service');
const xss = require('xss');
const noteRouter = express.Router();
const path = require('path');
const jsonParser = express.json();

const serializeNote = note => ({
  name: xss(note.name),
  content: xss(note.content),
  id: note.id,
  folder: note.folder
});

noteRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NoteService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder, name, content } = req.body;
    const newNote = {
      folder: folder,
      name: name,
      content: content
    };
    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body`
          }
        });
      }
    }
    NoteService.insertNote(req.app.get('db'), newNote).then(note => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${note.id}`))
        .json(serializeNote(note));
    });
  });

noteRouter
  .route('/:note_id')
  .all((req, res, next) => {
    NoteService.getById(req.app.get('db'), req.params.note_id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    NoteService.deleteNote(req.app.get('db'), req.params.note_id)
      .then(() => {
        req.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder, name, content } = req.body;
    const newNote = {
      folder: folder,
      name: name,
      content: content
    };
    const numberOfValues = Object.values(newNote).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request must contain a folder, name, or content`
        }
      });
    NoteService.updateNote(req.app.get('db'), req.params.note_id, newNote)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;
