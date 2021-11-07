const cron = require('node-cron');
const { updateFile } = require('./blogService');

cron.schedule('0 0 * * *', function () {
    updateFile();
});

updateFile();
