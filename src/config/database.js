const mongoose = require("mongoose");
const logger = require("./logger");


const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        if (!dbURI) {
            throw new Error('Database URI is missing from .env');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI,
            /* {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                } */
        );
        logger.info(`MongoDB Connected ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection error :${error}`);
        process.exit(1);
    }
}

module.exports = connectDB;