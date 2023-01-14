const debug = require("debug")("openai-nodejs-cli");

module.exports = async function f(authToken, job) {
  // TODO refactor this to use async await
  return new Promise(async (resolve, reject) => {
    // retrieve orgId for the authToken
    const token = process.env.OPENAI_API_KEY;
    const checkTimer = setInterval(async function () {
      // TODO rewrite for OpenAI job polling
      // https://beta.openai.com/docs/api-reference/fine-tunes/retrieve
      let response = await axios({
        method: "GET",
        url: process.env.OPEN_API_FINE_TUNE_ENDPOINT,
        headers: headers,
        responseType: "json",
      });
      // TODO modify based on OpenAI job responses
      if (retrievedJob.status === 'success') {
        clearInterval(checkTimer);
        //on success construct the url to retrieve the asset from the web asset manager using using job.inddPackageUri
        debug("job complete");
        // TODO download the job file
        resolve(retrievedJob);
      } else if (retrievedJob.status === 'error') {
        clearInterval(checkTimer);
        debug("job failed");
        debug("%O", retrievedJob.error);
        reject(new Error(retrievedJob.error.message));
      } else {
        debug("poll job: " + job.id.toString());
      }
    }, 1000);
  });
};
