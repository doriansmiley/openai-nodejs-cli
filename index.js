#!/usr/bin/env node

require('dotenv').config();
const createFineTuningJob = require("./commands/createFineTuningJob");
const getFineTuningJob = require("./commands/getFineTuningJob");
const debug = require("debug")("openai-nodejs-cli");

debug(`process env: ${process.env}`);

const command = process.argv[2];
debug("command: " + command);
debug("argv: " + process.argv);

const execute = async function (command) {
    try {
        switch (command) {
            case "--create-fine-tune-job":
            case "-cft":
                const [specFile, trainingData, validationData] = process.argv.slice(3);
                if (!specFile || !trainingData) {
                    throw new Error(
                        "Missing required params: specFile,trainingData are required."
                    );
                }
                debug(`args specFile: ${specFile}`);
                debug(`args trainingData: ${trainingData}`);
                debug(`args validationData: ${validationData}`);
                return await createFineTuningJob({ specFile, trainingData, validationData });
            case "--get-job":
            case "-gjb":
                const [jobId] = process.argv.slice(3);
                if (!jobId) {
                    throw new Error(
                        "Missing required params: jobId is required."
                    );
                }
                debug(`args specFile: ${jobId}`);
                return await getFineTuningJob({ jobId });
            case "--help":
            case "-h":
            default:
                console.log(
                    "Options: \n" +
                    "        -cft --create-fine-tune-job [specFile, trainingData, validationData]\n" +
                    "                specFile -       relative path (from current directory) to the job spec json file.\n" +
                    "                trainingData -   relative path (from current directory) to the job training data json file.\n" +
                    "                validationData - relative path (from current directory) to the validation data json file.\n" +
                    "        -gjb --get-job [jobId]\n" +
                    "                jobId -          The id of the job returned in the create call.\n" +
                    "        -h --help\n" +
                    "                Prints the help menu.\n"
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
