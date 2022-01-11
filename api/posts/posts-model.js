const db = require('../../data/db-config');

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
};

function find() {
  return db('posts');
}

function findById(id) {
  return db('posts').where({ id: Number(id) }).first()
}

async function insert(post) {
  const [id] = await db('posts').insert(post);

  return findById(id);
}

function update(id, changes) {
  return db('posts')
    .where('id', id)
    .update(changes, '*')
}

function remove(id) {
  return db('posts')
    .where('id', id)
    .del();
}

function findPostComments(postId) {
  return db('comments')
    .join('posts', 'posts.id', 'post_id')
    .select('comments.*', 'title as post')
    .where('post_id', postId);
}

function findCommentById(id) {
  return db('comments')
    .join('posts', 'posts.id', 'post_id')
    .select('comments.*', 'title as post')
    .where('comments.id', id).first();
}

function insertComment(comment) {
  return db('comments')
    .insert(comment)
    .then(ids => ({ id: ids[0] }));
}
