const express = require('express');
const FolderService = require('./folder-service');
const xss = require('xss');
const folderRouter = express.Router();
const path = require('path');
const jsonParser = express.json();

const serializeFolder = folder => ({
  folder_name: xss(folder.folder_name),
  id: folder.id
});

folderRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FolderService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;

    const newFolder = { folder_name: folder_name };
    for (const [key, value] of Object.entries(newFolder)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    FolderService.insertFolder(req.app.get('db'), newFolder).then(folder => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${folder.id}`))
        .json(serializeFolder(folder));
    });
  });

folderRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FolderService.getById(req.app.get('db'), req.params.folder_id)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    FolderService.deleteFolder(req.app.get('db'), req.params.folder_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const folder = { folder_name: folder_name };

    const numberOfValues = Object.values(folder).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request must contain a name`
        }
      });
    FolderService.updateFolder(req.app.get('db'), req.params.folder_id, folder)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;
