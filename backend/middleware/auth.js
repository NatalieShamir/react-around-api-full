const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(UnauthorizedError('Authorization error'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(UnauthorizedError('Authorization error'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
