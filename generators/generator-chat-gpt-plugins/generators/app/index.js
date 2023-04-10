"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require('path');
const fs = require('fs');

module.exports = class extends Generator {
  async prompting() {
    const prompts = [
      {
        type: "input",
        name: "humanName",
        message: "Enter a name for the plugin (for humans):",
        validate: (input) => {
          if (input.length > 50) {
            return `Plugin name must be less than or equal to 50 characters. You entered ${input.length} characters.`;
          }
          return true;
        },
        default: "TODO Plugin"
      },
      {
        type: "input",
        name: "modelName",
        message: "Enter a name for the plugin (for models):",
        validate: (input) => {
          if (input.length > 50) {
            return `Plugin name must be less than or equal to 50 characters. You entered ${input.length} characters.`;
          }
          return true;
        },
        default: "todo"
      },
      {
        type: "input",
        name: "humanDescription",
        message: "Enter a description for the plugin (for humans):",
        validate: (input) => {
          if (input.length > 120) {
            return `Plugin description must be less than or equal to 120 characters. You entered ${input.length} characters.`;
          }
          return true;
        },
        default:
          "Plugin for managing a TODO list. You can add, remove and view your TODOs."
      },
      {
        type: "input",
        name: "modelDescription",
        message: "Enter a description for the plugin (for models):",
        validate: (input) => {
          if (input.length > 8000) {
            return `Plugin description must be less than or equal to 8000 characters. You entered ${input.length} characters.`;
          }
          return true;
        },
        default:
          "Plugin for managing a TODO list. You can add, remove and view your TODOs."
      },
      {
        type: "list",
        name: "authType",
        message: "Choose an authentication type:",
        choices: [
          {
            name: "None",
            value: "none"
          },
          {
            name: "App-level API keys",
            value: "service_http"
          },
          {
            name: "User-level HTTP authentication",
            value: "user_http"
          },
          {
            name: "OAuth",
            value: "oauth"
          }
        ]
      },
      {
        type: "input",
        name: "verificationTokens",
        message: "Enter the verification tokens in the following format: '[service, token], [service, token]'",
        validate: input => {
          if (input.trim().length === 0) {
            return "Please enter the verification tokens";
          }
          const tokens = input.split(",").map(token => token.trim());
          for (const token of tokens) {
            if (!/\[.*?,.*?\]/.test(token)) {
              return "Invalid token format. Please use '[service, token]' format";
            }
          }
          return true;
        },
        when: answers => answers.authType === "service_http" || answers.authType === "oauth"
      },
      {
        type: "input",
        name: "oauthClientUrl",
        message: "Enter the OAuth URL where a user is directed to for the OAuth authentication flow to begin",
        validate: input => {
          if (answers.authType === "oauth") {
            const urlPattern = /^(http:\/\/|https:\/\/)/;
            if (!urlPattern.test(input)) {
              return "Please enter a valid URL starting with 'http://' or 'https://'";
            }
          }
          return true;
        },
        when: answers => answers.authType === "oauth"
      },
      {
        type: "input",
        name: "oauthAuthorizationUrl",
        message: "Enter the endpoint used to exchange OAuth code with access token",
        validate: input => {
          if (answers.authType === "oauth") {
            const urlPattern = /^(http:\/\/|https:\/\/)/;
            if (!urlPattern.test(input)) {
              return "Please enter a valid URL starting with 'http://' or 'https://'";
            }
          }
          return true;
        },
        when: answers => answers.authType === "oauth"
      },
      {
        type: "checkbox",
        name: "oauthScope",
        message: "Select the OAuth scope(s) required to accomplish operations on the user's behalf.",
        choices: [
          {
            name: "read",
            value: "read"
          },
          {
            name: "write",
            value: "write"
          },
          {
            name: "delete",
            value: "delete"
          }
        ],
        when: answers => answers.authType === "oauth"
      },
      {
        type: "list",
        name: "oauthAuthorizationContentType",
        message: "When exchanging OAuth code with access token, the expected header 'content-type'",
        choices: [
          {
            name: "application/json",
            value: "application/json"
          },
          {
            name: "application/xml",
            value: "application/xml"
          },
          {
            name: "application/x-www-form-urlencoded",
            value: "application/x-www-form-urlencoded"
          },
          {
            name: "multipart/form-data",
            value: "multipart/form-data"
          },
          {
            name: "text/plain",
            value: "text/plain"
          }
        ],
        when: answers => answers.authType === "oauth"
      },
      {
        type: "input",
        name: "apiUrl",
        message: "Enter the URL for the OpenAPI spec file:",
        default: "http://localhost:3333/openapi.yaml"
      },
      {
        type: "confirm",
        name: "isUserAuthenticated",
        message: "Does the plugin require user authentication?",
        default: false
      },
      {
        type: "input",
        name: "logoUrl",
        message: "Enter the URL for the plugin logo:",
        default: "http://localhost:3333/logo.png"
      },
      {
        type: "input",
        name: "contactEmail",
        message: "Enter the contact email for the plugin:",
        default: "support@example.com"
      },
      {
        type: "input",
        name: "legalInfoUrl",
        message: "Enter the URL for the legal information for the plugin:",
        default: "http://www.example.com/legal"
      },
      {
        type: "list",
        name: "httpAuthType",
        choices: [
          {
            name: "bearer",
            value: "bearer"
          },
          {
            name: "basic",
            value: "basic"
          },
        ],
        message: "Select the http authorization type",
        default: "basic",
        when: (answers) => {
          return answers.authType === "service_http" || answers.authType === "user_http";
        },
      },
      {
        type: "input",
        name: "openApiSpec",
        message: "Enter the path to an OpenAPI spec file (or leave blank for default):",
        default: "openapi.yaml",
        validate: input => {
          if (input) {
            const filePath = path.resolve(process.cwd(), input);
            try {
              fs.accessSync(filePath, fs.constants.R_OK);
              return true;
            } catch (err) {
              return `Unable to read file at ${input}. Please check the file path.`;
            }
          }
          return true;
        },
      }
    ];

    this.answers = await this.prompt(prompts);
  }

  writing() {
    const {
      humanName,
      modelName,
      humanDescription,
      modelDescription,
      authType,
      httpAuthType,
      oauthClientUrl,
      oauthScope,
      oauthAuthorizationUrl,
      oauthAuthorizationContentType,
      isUserAuthenticated,
      verificationTokens,
      apiUrl,
      logoUrl,
      contactEmail,
      legalInfoUrl,
      openApiSpec
    } = this.answers;

    const auth = {
      type: authType,
    };

    // Set auth fields based on the selected auth type
    if (authType === "none") {
      // Do nothing
    } else if (authType === "apikey") {
      auth.authorization_type = "ApiKey";
    } else if (authType === "user_http") {
      auth.authorization_type = "Http";
      auth.http_auth_type = httpAuthType;
    } else if (authType === "service_http") {
      auth.authorization_type = "Http";
      auth.http_auth_type = httpAuthType;
      auth.verification_tokens = verificationTokens
        .split('], [')
        .map((tupleStr) =>
          tupleStr.replace(/[\[\]"']/g, '').split(',').map((str) => str.trim())
        );

    } else if (authType === "oauth") {
      auth.client_url = oauthClientUrl;
      auth.scope = oauthScope;
      auth.authorization_url = oauthAuthorizationUrl;
      auth.authorization_content_type = oauthAuthorizationContentType;
      auth.verification_tokens = verificationTokens
        .split('], [')
        .map((tupleStr) =>
          tupleStr.replace(/[\[\]"']/g, '').split(',').map((str) => str.trim())
        );
    }

    if (openApiSpec) {
      this.fs.copy(
        this.templatePath(openApiSpec),
        this.destinationPath("openapi.yaml")
      );
    } else {
      this.fs.copyTpl(
        this.templatePath("openapi.yaml"),
        this.destinationPath("openapi.yaml"),
        {
          humanName,
          humanDescription
        }
      );
    }

    this.fs.copyTpl(
      this.templatePath("api-plugin.json"),
      this.destinationPath("api-plugin.json"),
      {
        humanName,
        modelName,
        humanDescription,
        modelDescription,
        authType,
        authorizationType: httpAuthType,
        clientUrl: auth.client_url,
        verificationTokens: auth.verification_tokens,
        authorizationUrl: auth.authorization_url,
        authorizationContentType: auth.authorization_content_type,
        scope: auth.scope,
        apiUrl,
        isUserAuthenticated,
        logoUrl,
        contactEmail,
        legalInfoUrl,
      }
    );
  }

install() {
    this.installDependencies();
  }
};
