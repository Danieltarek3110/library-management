const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Library Management System APIs",
    version: "1.0.0",
    description: "My API Description",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/Router/bookRouter.js",
    "./src/Router/userRouter.js",
    "./src/Router/adminRouter.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
