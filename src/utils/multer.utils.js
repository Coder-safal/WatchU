const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * Helper function to get the current date as YYYY-MM-DD
 */
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}


function cleanupOldDirectories(baseDir) {
    const now = Date.now();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

    if (fs.existsSync(baseDir)) {
        fs.readdirSync(baseDir, { withFileTypes: true }).forEach((file) => {
            if (file.isDirectory()) {
                const dirPath = path.join(baseDir, file.name);
                const stats = fs.statSync(dirPath);

                // Check if the directory is older than one week
                if (now - stats.mtimeMs > oneWeekInMs) {
                    fs.rmSync(dirPath, { recursive: true, force: true });
                    console.log(`Removed old directory: ${dirPath}`);
                }
            }
        });
    }
}

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req?.user?._id; // Assume `userId` is sent in the request body
        const currentDate = getCurrentDate();
        const baseDir = path.join(__dirname,'../../', 'public', 'images', userId.toString());

        // Cleanup old directories
        cleanupOldDirectories(baseDir);

        // Directory for today's uploads
        const newPath = path.join(baseDir, currentDate);

        // Create directory if it doesn't exist
        if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
        }

        cb(null, newPath);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFilename);
    }
});

// Multer upload instance
module.exports.upload = multer({ storage: storage });
