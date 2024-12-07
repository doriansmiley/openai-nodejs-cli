const debug = require('debug')('openai-nodejs-cli');
const { OpenAI } = require('openai');

module.exports = async function f(job) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return new Promise((resolve, reject) => {
    const checkTimer = setInterval(async () => {
      debug(`Polling fine-tune job: ${job.id}`);
      try {
        const result = await openai.fineTuning.jobs.retrieve(job.id);
        const status = result.status;

        switch (status) {
          case 'succeeded':
            clearInterval(checkTimer);
            debug('Job complete');
            resolve(result);
            break;
          case 'error':
            clearInterval(checkTimer);
            debug(`Job failed: ${JSON.stringify(result, null, 2)}`);
            reject(new Error('Job failed'));
            break;
          default:
            // Still running, do nothing and let the next interval fire.
            debug(`Job still in progress, status: ${status}`);
        }
      } catch (err) {
        clearInterval(checkTimer);
        debug(`Error polling job: ${err.message}`);
        reject(err);
      }
    }, 1000);
  });
};
