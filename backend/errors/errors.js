const BAD_REQUEST_STATUS = 400;
const NOT_FOUND_STATUS = 404;
const INTERNAL_SERVER_ERROR = 500;
const ACCESS_DENIED_ERROR = 403;
const CONFLICT_ERROR = 409;
const BAD_REQUEST_ERROR_MESSAGE = { message: 'Invalid ID format' };
const NOT_FOUND_ERR_MESSAGE = { message: 'Requested resource not found' };
const INTERNAL_SERVER_ERR_MESSAGE = { message: 'An error has occured on the server' };
const UNAUTHORIZED_ERR_MESSAGE = { message: 'Incorrect email or password' };

module.exports = {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR_MESSAGE,
  NOT_FOUND_ERR_MESSAGE,
  INTERNAL_SERVER_ERR_MESSAGE,
  UNAUTHORIZED_ERR_MESSAGE,
  ACCESS_DENIED_ERROR,
  CONFLICT_ERROR,
};
