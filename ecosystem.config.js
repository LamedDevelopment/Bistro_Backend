module.exports = {
  apps: [
    {
      name: 'Kalos-rest-env',
      script: 'npm',
      args: 'run dev',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        PORT: 3000,
        ROOT_API: '/api/v1',
        ENVIROMENT: 'Development Server',
        // MONGO_URL: 'mongodb://127.0.0.1:27017/EternalGod',
        MONGO_URL: 'mongodb+srv://lameddev:Santiago23@cluster0.sqoen9c.mongodb.net/EternalGod',
        URL_MAIL: 'https://devback.bellezaap.com',
        URL_BACKEND: 'https://devback.bellezaap.com',
        URL_QR: 'https://bellezaap.com/usr/qr',
        USERDB: 'devkalos',
        PWDDB: 'K4l0s',
        JWT_SECRET: '**Enl4c4s4d3p1n0ch0t0d0scu3nt4nh4st40ch0@@**',
        QR_SECRET: '**T3n3m0sD4t0sd3Usu4r10sP4r4P0d3rR3g1str4rl0s3nK4l0s**',
        GIUDLGN: '171572853823-to9tfe6gosnlek0ervd7psc4v1s2udl0.apps.googleusercontent.com',
        LGNCOLSAD:'https://kalos.colsad.com/api/v1/login',
      }
    },
    {
      name: 'Kalos-rest-prod',
      script: 'npm',
      args: 'run prod',
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        PORT: 4000,
        ROOT_API: '/api/v1',
        ENVIRONMENT: 'Production Server',
        MONGO_URL: 'mongodb+srv://lameddev:Santiago23@cluster0.sqoen9c.mongodb.net/Bina',
        URL_MAIL: 'https://beautytech.kalos.icu',
        URL_BACKEND: 'https://beautytech.kalos.icu',
        URL_QR: 'https://beautytech.kalos.icu/usr/qr',
        USERDB: 'prodkalos',
        PWDDB: 'K4l0s',
        JWT_SECRET: '**Enl4c4s4d3p1n0ch0t0d0scu3nt4nh4st40ch0@@**',
        QR_SECRET: '**T3n3m0sD4t0sd3Usu4r10sP4r4P0d3rR3g1str4rl0s3nK4l0s**',
        GIUDLGN: '171572853823-p295mq0rruako4scmdfi02357g7oa6ki.apps.googleusercontent.com',
        LGNCOLSAD:'https://kalos.colsad.com/api/v1/login',
      }
    }
  ]
};

