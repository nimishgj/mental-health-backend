module.exports = {
    NODE_PORT: 3000,
    mongoUri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/mental-health-dev-db?authSource=admin`,
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true, 
        autoIndex: true,
    }
};