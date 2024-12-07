const debug = require('debug')('openai-nodejs-cli');
const yeomanEnv = require("yeoman-environment").createEnv();
const generatorName = require.resolve(
  "../generators/generator-chat-gpt-plugins/generators/app"
);
module.exports = async function f() {
  yeomanEnv.register(generatorName, "openai:plugin");
  await yeomanEnv.run("openai:plugin");
};
