function respBinder(success, message, data) {
    return {
        success,
        message,
        data
    };
}



module.exports = { respBinder }; // Use CommonJS exports