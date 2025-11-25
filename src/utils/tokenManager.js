const Jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  const token = Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '10m' });
  return token;
};

const generateRefreshToken = (payload) => {
  const token = Jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: '3d' });
  return token;
};

const verifyRefreshTokenSignature = (token) => {
  try {
    const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshTokenSignature,
};
