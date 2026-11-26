
const store = require('../data/postStore');

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 2;

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0
    ? parsedPage
    : 1;

  const requestedLimit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : DEFAULT_LIMIT;

  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const total = allPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    data: allPosts.slice(start, start + limit),
    meta: {
      page,
      limit,
      total,
      pages
    }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  const post = store.getPostById(id);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  return store.incrementLikes(id);
}

function explode() {
  const err = new Error('Internal server error');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
