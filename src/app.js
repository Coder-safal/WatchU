const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const router = require("./routes/index");
const app = express();
const logger = require("./config/logger");
const errorMiddleware = require("./middleware/error.middleware");
const path = require("path");

// Enable trust proxy to handle 'X-Forwarded-For' headers correctly
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 'loopback, linklocal, uniquelocal' : false);
// Security middleware


// security middleware
app.use(cors());// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : '*'
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Routes
app.use('/api', router);

// Errors middleware
app.use(errorMiddleware);

module.exports = app;
