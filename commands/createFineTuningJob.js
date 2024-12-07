const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const debug = require("debug")("openai-nodejs-cli");
const { OpenAI, toFile } = require("openai");

module.exports = async function f({ specFile, trainingData, validationData }) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const rootDir = path.resolve(".");
  const specFileBuffer = fs.readFileSync(path.join(rootDir, specFile));
  const spec = JSON.parse(specFileBuffer.toString());
  let trainingFileId;
  let validationFileId;

  const fileMap = new Map();

  // Upload training file if provided
  const fileResult = await openai.files.create({
    file: await toFile(fs.createReadStream(path.join(rootDir, trainingData)), `training-data-${uuidv4()}.jsonl`),
    purpose: 'fine-tune'
  });
  trainingFileId = fileResult.id;
  debug(`Training file uploaded: ${JSON.stringify(fileResult)}`);

  // Upload validation file if provided
  if (validationData) {
    const fileResult = await openai.files.create({
      file: await toFile(fs.createReadStream(path.join(rootDir, validationData)), `validation-data-${uuidv4()}.jsonl`),
      purpose: 'fine-tune'
    });
    validationFileId = fileResult.id;
    debug(`Validation file uploaded: ${JSON.stringify(fileResult)}`);
  }

  const params = {
    ...spec,
    training_file: trainingFileId,
  };

  if (validationFileId) {
    params.validation_file = validationFileId;
  }

  // Remove any null values from params since the API may reject them
  Object.keys(params).forEach(key => {
    if (params[key] === null) {
      delete params[key];
    }
  });

  debug(`Fine-tune parameters: ${JSON.stringify(params, null, 2)}`);

  // Create the fine-tune job
  const fineTuneResult = await openai.fineTuning.jobs.create(params);
  debug(`Fine-tune job created: ${JSON.stringify(fineTuneResult)}`);

  return fineTuneResult;
};
