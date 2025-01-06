module.exports = (app, host) => {
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const User = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
    },
    username: {
      type: "string",
    },
    email: {
      type: "string",
      format: "email",
    },
    displayName: {
      type: "string",
    }
  },
  required: ["username"],
};

const ProjectUserPermission = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
    },
    projId: {
      type: "integer",
    },
    userId: {
      type: "integer",
    },
    permId: {
      type: "integer",
    },
    permission: {
      type: "object",
      properties: {
        key: {
          type: "string",
        },
      },
      required: ["key"],
    },
  },
  required: ["id", "projId", "userId", "permId", "permission"],
};

const Annotation = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
    },
    projId: {
      type: "integer",
    },
    data: {
      type: "string",
    },
    createdBy: {
      type: "integer",
    },
  },
  required: ["projId", "data", "createdBy"],
};

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      description: "user-service api docs",
      title: "user-service api docs",
      version: "1.0.0",
    },
    openapi: "3.0.0",
    components: {
      schemas: {
        User,
        ProjectUserPermission,
        Annotation,
      }
    },
    host,
    basePath: "/api", // api path
  },
  apis: [path.join(__dirname, "./app/controllers/*.js")],
};

const docs = swaggerJsdoc(swaggerOptions);
const root = "/api-docs";
app.use(root, swaggerUi.serve, swaggerUi.setup(docs));
console.log(`Swagger initialized, url: ${host}${root}`);
}