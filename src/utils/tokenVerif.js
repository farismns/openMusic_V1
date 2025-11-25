const Jwt = require('jsonwebtoken');

function verifyAccessToken(request, h) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    const error = new Error('Access token tidak ditemukan');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    request.auth = { credentials: { userId: decoded.userId } };
    return decoded.userId;
  } catch (err) {
    const error = new Error('Access token tidak valid');
    error.statusCode = 401;
    throw error;
  }
}

module.exports = { verifyAccessToken };
