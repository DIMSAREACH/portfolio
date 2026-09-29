import config from './config/environment';
import app from './app';
import logger from './utils/logger';

const server = app.listen(config.PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});

export default server;
