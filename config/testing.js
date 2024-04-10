module.exports = {
    NODE_PORT: 3000,
    mongoUri: `mongodb://root:example@mongo:27017/mental-health-test-db?authSource=admin`,
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoIndex: true,
    }
};