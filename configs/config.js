const dotenv = require('dotenv');

dotenv.config();

const config = {
    HOST: process.env.BASE_HOST ,
    PORT: process.env.BASE_PORT,
    SHEET_ID: process.env.SHEET_ID,
    
    getHttpUrl: function() {
        return `${this.URL}:${this.PORT}`
    },
}

module.exports = config;