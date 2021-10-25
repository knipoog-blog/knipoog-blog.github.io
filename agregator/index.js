const {readAllFeeds} = require('./feedReader');

return readAllFeeds().then(() => {
  console.log('Done!');
});
