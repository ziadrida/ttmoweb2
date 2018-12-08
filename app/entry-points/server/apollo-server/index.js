import { ApolloServer } from 'apollo-server-express';
import { WebApp } from 'meteor/webapp';
import { getUser } from './get-user';
var mongoose = require('mongoose');
import { typeDefs, resolvers, mocks } from './exec-schema';
// Log env vars
const {
  MONGO_URL,

} = process.env;

console.log(
  '\nprocess.env.MONGO_URL', MONGO_URL,
);
if (MONGO_URL) {
try {

  mongoose.connect(MONGO_URL,{ useNewUrlParser: true })
  console.log("after sucessful connect to mongoosedb")
} catch(err) {
  console.log('error connecting to mongoose db err:',err)
}
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization),
  }),
});

server.applyMiddleware({
  app: WebApp.connectHandlers,
  path: '/graphql',
});

WebApp.connectHandlers.use('/graphql', (req, res) => {
  if (req.method === 'GET') {
    res.end();
  }
});
