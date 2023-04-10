"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-chat-gpt-plugins:app", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts({
      humanName: "Test Plugin",
      modelName: "test",
      humanDescription: "Test plugin description",
      modelDescription: "Test plugin description",
      authType: "none",
      apiUrl: "http://localhost:3333/openapi.yaml",
      isUserAuthenticated: false,
      logoUrl: "http://localhost:3333/logo.png",
      contactEmail: "test@example.com",
      legalInfoUrl: "http://www.example.com/legal"
    });
  });

  it("creates the api-plugin.json file", () => {
    assert.file(["api-plugin.json"]);

    const expected = {
      schema_version: "v1",
      name_for_human: "Test Plugin",
      name_for_model: "test",
      description_for_human: "Test plugin description",
      description_for_model: "Test plugin description",
      auth: {
        type: "none"
      },
      api: {
        type: "openapi",
        url: "http://localhost:3333/openapi.yaml",
        is_user_authenticated: false
      },
      logo_url: "http://localhost:3333/logo.png",
      contact_email: "test@example.com",
      legal_info_url: "http://www.example.com/legal"
    };

    assert.jsonFileContent("api-plugin.json", expected);
  });

  it("creates the openapi.yaml file with default content", () => {
    assert.file(["openapi.yaml"]);

    const expected = `openapi: 3.0.1
info:
  title: TODO Plugin
  description: A plugin that allows the user to create and manage a TODO list using ChatGPT.
  version: 'v1'
servers:
  - url: http://localhost:3333
paths:
  /todos:
    get:
      operationId: getTodos
      summary: Get the list of todos
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/getTodosResponse'
components:
  schemas:
    getTodosResponse:
      type: object
      properties:
        todos:
          type: array
          items:
            type: string
          description: The list of todos.
`;

    assert.fileContent("openapi.yaml", expected);
  });

  it("creates the api-plugin.json file with service_http auth type", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({
        humanName: "Test Plugin",
        modelName: "test",
        humanDescription: "Test plugin description",
        modelDescription: "Test plugin description",
        authType: "service_http",
        apiUrl: "http://localhost:3333/openapi.yaml",
        isUserAuthenticated: false,
        logoUrl: "http://localhost:3333/logo.png",
        contactEmail: "test@example.com",
        legalInfoUrl: "http://www.example.com/legal",
        httpAuthType: "bearer",
        verificationToken: "test-verification-token",
        verificationTokens: '["test", "test-verification-token"]'
      })
      .then(() => {
        assert.jsonFileContent("api-plugin.json", {
          auth: {
            type: "service_http",
            authorization_type: "bearer",
            verification_tokens: {
              "test": "test-verification-token"
            }
          }
        });
      });
  });

  it("creates the api-plugin.json file with user_http auth type", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({
        humanName: "Test Plugin",
        modelName: "test",
        humanDescription: "Test plugin description",
        modelDescription: "Test plugin description",
        authType: "user_http",
        apiUrl: "http://localhost:3333/openapi.yaml",
        isUserAuthenticated: true,
        logoUrl: "http://localhost:3333/logo.png",
        contactEmail: "test@example.com",
        legalInfoUrl: "http://www.example.com/legal",
        httpAuthType: "basic",
        verificationToken: "test-verification-token",
        verificationTokens: '["test", "test-verification-token"]'
      })
      .then(() => {
        assert.jsonFileContent("api-plugin.json", {
          auth: {
            type: "user_http",
            authorization_type: "basic"
          }
        });
      });
  });

  it("creates the api-plugin.json file with oauth auth type", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({
        humanName: "Test Plugin",
        modelName: "test",
        humanDescription: "Test plugin description",
        modelDescription: "Test plugin description",
        authType: "oauth",
        apiUrl: "http://localhost:3333/openapi.yaml",
        isUserAuthenticated: false,
        logoUrl: "http://localhost:3333/logo.png",
        contactEmail: "test@example.com",
        legalInfoUrl: "http://www.example.com/legal",
        oauthClientUrl: "http://localhost:3333/oauth-client",
        oauthScope: "read write",
        oauthAuthorizationUrl: "http://localhost:3333/oauth-authorization",
        oauthAuthorizationContentType: "application/json",
        verificationTokens: '["test", "test-verification-token"]'
      })
      .then(() => {
        assert.jsonFileContent("api-plugin.json", {
          auth: {
            type: "oauth",
            client_url: "http://localhost:3333/oauth-client",
            scope: "read write",
            authorization_url: "http://localhost:3333/oauth-authorization",
            authorization_content_type: "application/json",
            verification_tokens: {
              "test": "test-verification-token"
            }
          }
        });
      });
  });

});
