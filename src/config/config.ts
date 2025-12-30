export default () => ({
  port: parseInt(process.env.APP_PORT!, 10) || 3000,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
});