#!/usr/bin/env node

const createFineTuningJob = require("./commands/createFineTuningJob");
const debug = require("debug")("openai-nodejs-cli");

console.log("Designer CLI. See below for proper usage.");

const command = process.argv[2];
debug("command: " + command);

const execute = async function (command) {
  // TODO: add removal operations
  try {
    switch (command) {
      case "--create-fine-tune-job":
      case "-cft":
        const [specFile] = process.argv.slice(3);
        if (!specFile) {
          throw new Error(
            "Missing required params: specFile is required."
          );
        }
        debug(`args: ${specFile}`);
        return await createFineTuningJob(authToken);
      default:
        console.log(
          "Options: \n" +
            "        --create-fine-tune-job [specFile]\n" +
            "                specFile - relative path (from current directory) to the job spec json file.\n"
        );
    }
  } catch (e) {
    console.log(
      "An error occurred. Turn debugging on for more details. To turn on: export DEBUG=openai-nodejs-cli"
    );
    debug(e);
  }
};

// no top level async, wrap in self executing async
(async function (command) {
  console.log(JSON.stringify(await execute(command)));
  process.exit(0);
})(command);
