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
  
  const Permission = {
    type: "object",
    properties: {
      key: {
        type: "string",
        description: "The unique key for the permission.",
        example: "Annotation.View",
      },
      desc: {
        type: "string",
        description: "A brief description of the permission.",
      },
    },
    required: ["key"],
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
    required: ["projId", "userId", "permId"],
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
    required: ["projId", "data"],
  };
  
  const Room = {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
      },
      name: {
        type: "string",
        description: "The name for the room.",
        example: "Room 1",
      },
      desc: {
        type: "string",
        description: "A brief description of the room.",
      },
      owner: {
        type: "integer",
        description: "The room owner's user ID.",
      },
      projId: {
        type: "integer",
      },
    },
    required: [""],
  }
  
  const StampTemplate = {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
      },
      name: {
        type: "string",
        description: "The name for the stamp template.",
        example: "Stamp1",
      },
      desc: {
        type: "string",
        description: "A brief description of the stamp template.",
      },
      data: {
        type: "string",
        description: "The data for the stamp template.",
      },
    },
    required: [""],
  }

  const SymbolFolder = {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "The unique identifier of the symbol folder"
      },
      name: {
        type: "string",
        description: "The name of the symbol folder"
      }
    },
    required: ["name"]
  };
  
  const Symbol = {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "The unique identifier of the symbol"
      },
      name: {
        type: "string",
        description: "The name of the symbol"
      },
      type: {
        type: "string",
        description: "The type of the symbol (SVG or PNG)"
      },
      data: {
        type: "string",
        description: "The data of the symbol"
      },
      folderId: {
        type: "integer",
        description: "The ID of the folder this symbol belongs to"
      }
    },
    required: ["name", "type", "data", "folderId"]
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
          Permission,
          ProjectUserPermission,
          Annotation,
          Room,
          StampTemplate,
          SymbolFolder,
          Symbol
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