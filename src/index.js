require('dotenv').config();
const app = require('./app');
const connectDB = require("./config/database");
const { initializeEmail } = require('./config/email');
const logger = require("./config/logger");

// Initilize services
const initilize = async () => {

    await connectDB();
    logger.info("MongoDB connected succesfully!");

    // initializeEmail();
    initializeEmail();
    logger.info("Initialize email succesfully!");

    // Start server
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        logger.info(`Server running on ${PORT} in ${process.env.NODE_ENV} mode`)
        console.log("Server is running at port ", PORT);
    })
}



// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});

initilize();
