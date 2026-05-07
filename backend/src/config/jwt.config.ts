export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'lab-only-jwt-secret',
  expiresIn: '15m'
};
