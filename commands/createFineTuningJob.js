const FormData = require("form-data");
const axios = require("axios");
const debug = require("debug")("openai-nodejs-cli");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const pollJob = require("./pollFineTuningJob");

module.exports = async function f({specFile, trainingData, validationData}) {
  const rootDir = path.resolve(".");
  const specFileBuffer = fs.readFileSync(rootDir + "/" + specFile);
  const spec = JSON.parse(specFileBuffer.toString());
  const files = [trainingData, validationData];
  const fileMap = new Map();

  const promises = files.map((file, index) => {
    if (!file) {
      return undefined;
    }
    const rootDir = path.resolve(".");
    const fileBuffer = fs.readFileSync(rootDir + "/" + trainingData);
    const form = new FormData();
    const filename = `${uuidv4()}.jsonl`;
    switch (index) {
      case 0:
        fileMap.set('trainingData', filename);
        break;
      case 1:
        fileMap.set('validationData', filename);
        break;
  }
    form.append("file", fileBuffer, { filename });
    form.append('purpose', 'fine-tune');
    const headers = form.getHeaders();
    headers["Authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`;
    debug(`headers ${headers}`);

    return axios.post(`${process.env.OPEN_API_FILES_ENDPOINT}`, form, {
      headers: {
        ...form.getHeaders(),
        ...headers
      },
    });
  }).filter((file) => file !== undefined);

  const results = await Promise.all(promises);
  results.forEach((result) => {
    switch (result.data.filename){
      case fileMap.get('trainingData'):
        fileMap.set('trainingData', result.data);
        break;
      case fileMap.get('validationData'):
        fileMap.set('validationData', result.data);
        break;
      default:
    }
  });

  const headers = {};
  headers["Content-Type"] = 'application/json';
  headers["Authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`;
  debug(`headers ${headers}`);
  const params = {
    ...spec,
    training_file: fileMap.get('trainingData').id,
  }
  // remove null keys or the API call will fail
  Object.keys(params).forEach(key => {
    if (params[key] === null) {
      delete params[key];
    }
  })
  if (fileMap.get('validationData')?.id) {
    params.validation_file = fileMap.get('validationData')?.id;
  }
  debug(`params ${params}`);
  const result = await axios.post(`${process.env.OPEN_API_FINE_TUNE_ENDPOINT}`, params, {
    headers: {
      ...headers
    },
  });

  return result.data;
};
