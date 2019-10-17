const express = require('express');
const FolderService = require('./folder-service');
const xss = require('xss');
const folderRouter = express.Router();

const serializeName = name => ({
  name: xss(name.name)
});

folderRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  FolderService.getAllFolders(knexInstance)
    .then(folders => {
      res.json(folders);
    })
    .catch(next);
});

module.exports = folderRouter;
