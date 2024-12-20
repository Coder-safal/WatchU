
class ApiResponse {
    constructor(statusCode, message = "success", data) {
        this.success = statusCode < 400;
        // this.statusCode = statusCode;
        this.data = {
            message
        }

        if (data && !Array.isArray(data)) {
            this.data = {
                message,
                user: { ...data }
            }
        }
        else if (data) {
            this.data = {
                message,
                user: [
                    ...data
                ]
            }
        }
    }
}

module.exports = ApiResponse;