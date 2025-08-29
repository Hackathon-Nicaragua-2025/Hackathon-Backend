export default () => {
  if (!process.env.BCRYPT_SALT_ROUNDS) {
    throw new Error('BCRYPT_SALT_ROUNDS is not set in the environment variables');
  }

  return {
    jwt: {
      accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
      refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
      secret: process.env.JWT_SECRET || 'your_default_jwt_secret',
    },
    bcrypt: {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    },
  };
};
