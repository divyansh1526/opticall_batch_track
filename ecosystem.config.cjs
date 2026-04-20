module.exports = {
  apps: [
    {
      name: 'opticall-backend',
      script: 'server/index.js',
      cwd: '/home/ubuntu/opticall_batch_track',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
    },
    {
      name: 'opticall-frontend',
      script: 'node_modules/.bin/vite',
      args: '--host 0.0.0.0 --port 5173',
      cwd: '/home/ubuntu/opticall_batch_track',
      interpreter: 'none',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
    },
  ],
};
