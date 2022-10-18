export default {
  /** --- main DB --- **/
  SMTP_SERVER: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  HOST:
    process.env.ENV_APP_ENV === 'development'
      ? `${process.env.BACKEND_HOST}:8080`
      : 'http://localhost:8080',
};
