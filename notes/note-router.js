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

noteRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  NoteService.getAllNotes(knexInstance)
    .then(notes => {
      res.json(notes);
    })
    .catch(next);
});

module.exports = noteRouter;
