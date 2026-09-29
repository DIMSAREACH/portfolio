import config from './config/environment';
import app from './app';

const server = app.listen(config.PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});

export default server;
