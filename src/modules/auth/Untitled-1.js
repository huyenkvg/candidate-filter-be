// backdend
module.exports = {
  apps : [{
    name:"tttn-backend",
    script: 'dist/src/main.js',
    watch: '.',
    env: {
      DATABASE_URL:"sqlserver://20.249.0.20:1433;database=STORAGE;username=sa;password=qKz5CfT3wB8pO3O;trustServerCertificate=true;",
      SMTP_PASSWORD:"huyen*123",
      SMTP_USERNAME:"n18dccn082@student.ptithcm.edu.vn",
      SMTP_PORT:587,
      SMTP_HOST:"smtp.gmail.com",
    }
  },],
};
