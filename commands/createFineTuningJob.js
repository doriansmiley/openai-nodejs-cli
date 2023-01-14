const FormData = require("form-data");
const axios = require("axios");
const debug = require("debug")("openai-nodejs-cli");
const fs = require("fs");
const path = require("path");

const pollJob = require("./pollFineTuningJob");

module.exports = async function f(specFile) {
  const rootDir = path.resolve(".");
  const specFileBuffer = fs.readFileSync(rootDir + "/" + specFile);
  var form = new FormData();
  form.append("file", specFileBuffer, { filename: "specfile.json" });
  //var headers = form.getHeaders();
  //headers["X-SPIToken-id"] = authToken;
  // debug(`headers ${headers}`);
  // send request to upload spec file using OpenAI file upload API
  // https://beta.openai.com/docs/api-reference/files/upload
  const response = await axios({
    method: "post",
    url: process.env.OPEN_API_FINE_TUNE_ENDPOINT,
    data: form,
    // headers: headers,
  });
  const uploadJob = response.data;
  const job = await pollJob(authToken, uploadJob);
  // TODO issue the fine tuning API request
  // https://beta.openai.com/docs/api-reference/fine-tunes/create
  return null;
};
