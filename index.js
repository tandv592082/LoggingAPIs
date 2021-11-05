const express = require('express');
const app = express();
const config = require('./configs/config');
const setupCridentials = require('./configs/googleSheet');
const moment = require('moment');
const { formatRawSheet } = require('./utils')

const spreadsheetId = config.SHEET_ID;

let initCount = 0;
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use(express.json());

(async () => {
    console.log('Setting google sheets ...');
    const [googleSheets, auth] = await setupCridentials();

    console.log('Finished setup google sheets ...');

    app.get('/get-reports', async (req, res) => {
        const query = req.query;
    
        const { data } = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: 'Phenikaa!C:I'
        });
        
        const records = formatRawSheet(data, query);
        res.status(200).json({
            msg: 'success',
            records
        });
    
    });

    app.put('/reset-count', (req, res) => {
        const {count} = req.body;
        initCount = count;
        res.status(200).json({
            success: true,
            msg: `Count: ${count}`
        })
    })

    app.get('/get-count', (req, res) => {
        res.status(200).json({
            success: true,
            msg: `Count: ${initCount}`
        })
    })

    app.post('/create-report', async (req, res) => {
        
        try {
            const {record} = req.body;
            const now = moment().format("HH:mm:ss - DD/MM/YYYY");
            initCount++;

            const locationRecords = record.map(el =>el.distance);
            const gpsRecords = record.map(el => `${el.gps_data.lat}-${el.gps_data.lng}`);
            const values = [];

            values.push([initCount, `${now}`, ...locationRecords,...gpsRecords]);
            console.log(values);

            await googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range:"Phenikaa!A:P",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values
                }
            });


            res.status(200).json({
                success: true,
                msg: 'Record to sheet successfully!'
            })

        } catch(error) {
            initCount --;
            res.status(404).json({
                success: false,
                msg: `Record get error ${error}`
            });
            
        }
    
    });
    
    app.listen(8002, () => {
        console.log('Server listening on http://localhost:8002');
    })
})()

