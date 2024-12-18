![Test Status](https://github.com/doriansmiley/openai-nodejs-cli/actions/workflows/test.yml/badge.svg)

# openai-nodejs-cli
NodeJS CLI tool for submitting fine-tuning jobs to OpenAI. 
This toll can also generate stub code for GPT plugins. Please refer to the
[OpenAI documentation](https://platform.openai.com/docs/plugins/getting-started/plugin-manifest) 
for a detailed explanation of the plugin manifest and architecture.

# Options:
```
-cft --create-fine-tune-job [specFile, trainingData, validationData]
    specFile -       relative path (from current directory) to the job spec json file.
    trainingData -   relative path (from current directory) to the job training data json file.
    validationData - relative path (from current directory) to the validation data json file.

-gjb --get-job [jobId]
    jobId -          The id of the job returned in the create call.
-h --help
    Prints the help menu.
```

# Example Usage
```shell
node index -cft ./specFile.json ./trainingData.jsonl ./validationData.jsonl
```
### IMPORTANT: don't forget to add your .env file!
```shell
OPENAI_API_KEY=<YOUR_SECRET>
DEBUG=openai-nodejs-cli
```
Note the referenced files are included in this repo. Please refer to the
[OpenAI Fine-Tuning](https://beta.openai.com/docs/api-reference/fine-tunes/create) guide for more information about the file format
and settings.

Below is a typical response with the identifiers replaced with `xxx`
```json
{
    "object": "fine_tuning.job",
    "id": "ftjob-1234",
    "model": "gpt-4o-mini-2024-07-18",
    "created_at": 1733604278,
    "finished_at": null,
    "fine_tuned_model": null,
    "organization_id": "org-1234",
    "result_files": [],
    "status": "validating_files",
    "validation_file": null,
    "training_file": "file-1234",
    "hyperparameters": {
        "n_epochs": 1
    },
    "trained_tokens": null,
    "error": {},
    "user_provided_suffix": null,
    "seed": 2139682031,
    "estimated_finish": null,
    "integrations": []
}
```
You can use the returned `id` property to poll the API:
```shell
node index -gjb ft-PSUaVtJNV3JzJAhUuAFh7g6M
```
IMPORTANT: it can take anywhere from 20-30 minutes for a job to succeed or days
depending on OpenAI service health.

There is a command under `./commands/pollFineTuningJob.js` that will poll the API, 
but I have not implemented it due to the long response times


