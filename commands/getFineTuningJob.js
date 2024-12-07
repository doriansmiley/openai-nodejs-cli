const { OpenAI } = require("openai");
const debug = require("debug")("openai-nodejs-cli");

module.exports = async function f({ jobId }) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  debug(`Retrieving fine-tune job with ID: ${jobId}`);

  // The SDK handles headers and endpoints internally.
  const result = await openai.fineTuning.jobs.retrieve(jobId);
  return result;
};
