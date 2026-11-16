const config = {
  app: {
    name: "BookVerse",
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bookverse",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
};

module.exports = config;
