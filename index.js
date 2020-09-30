const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const config = require("./config");
const db = require("./db");

const validateTokenAndGetUserId = (token) => {
  try {
    const { _id } = jwt.verify(token, config.JWT_SECRET);
    const user = db.get("users").find({ _id }).value();
    return user._id;
  } catch {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const context = {};

    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(" ");
      context.userId = validateTokenAndGetUserId(token);
    }

    return context;
  },
});

server.listen(
  {port: process.env.PORT || 4000}
).then(({ url }) => {
  console.log(`Server is running at ${url} `);
});
