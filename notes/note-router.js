const FolderService = {
  getAllnotes(knex) {
    return knex.select('*').from('notes');
  },
  insertNote(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('notes')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from('notes')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteNote(knex, id) {
    return knex('note')
      .where({ id })
      .delete();
  },
  updateFolder(knex, id, updateNote) {
    return knex('note')
      .where({ id })
      .update(updateNote);
  }
};

module.exports = FolderService;
