const axios = require('axios');
const debug = require('debug')('openai-nodejs-cli');

module.exports = async function f({jobId}) {
  const headers = {};
  headers['Content-Type'] = 'application/json';
  headers['Authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`
  debug(`headers ${headers}`);
  const result = await axios.get(`${process.env.OPEN_API_FINE_TUNE_ENDPOINT}/${jobId}`, {
    headers: {
      ...headers
    },
  });
  return result.data;
};
