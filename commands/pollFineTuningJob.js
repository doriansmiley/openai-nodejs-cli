const axios = require('axios');
const debug = require('debug')('openai-nodejs-cli');

// IMPORTANT: this code does work  but fine tuning jobs take a long time to complete, 10/30 minutes but sometimes days
module.exports = async function f(job) {
  return new Promise(async (resolve, reject) => {
    const checkTimer = setInterval(async function () {
      const headers = {};
      headers['Content-Type'] = 'application/json';
      headers['Authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`
      debug(`headers ${headers}`);
      const result = await axios.get(`${process.env.OPEN_API_FINE_TUNE_ENDPOINT}/${job.id}`, {
        headers: {
          ...headers
        },
      });

      switch(result.data.status){
        case 'succeeded':
          clearInterval(checkTimer);
          debug('job complete');
          resolve(result.data);
          break;
        case 'error':
          // TODO figure out if they return the status error, it's not in the docs
          clearInterval(checkTimer);
          debug(`job failed: ${result.data}`);
          reject(new Error('job failed'));
          break;
        default:
          debug('poll job: ' + job.id.toString());
      }

    }, 1000);
  });
};
