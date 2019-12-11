const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/...',
  port: process.env.PORT || 9002,
  baseAssets: '...',
  baseAPI: '...',
  baseUrl: '...',
  adminAssets: '...'
};

export default config;
