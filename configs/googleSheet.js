const {google} = require('googleapis');

const keyFile = 'cridentials.json';
const scopes = 'https://www.googleapis.com/auth/spreadsheets';



const setupCridentials = async () => {
    const auth = new google.auth.GoogleAuth({ keyFile, scopes});

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: 'v4',
        auth: client
    });
    return [googleSheets, auth];
}


module.exports = setupCridentials;