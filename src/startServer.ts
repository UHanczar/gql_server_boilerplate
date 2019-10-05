import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';

import { redis } from './redis';
import { createTypeormConnection } from "./utils/defineDatabase";
import { confirmEmail } from "./routes/confirmEmail";
import { generateSchema } from "./utils/generateSchema";
import { TEST_SESSION_SECRET } from "./testSetup/constants";

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: generateSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host"),
      session: request.session,
    }),
  });

  const cors = {
    credentials: true,
    origin: process.env.FRONTEND_HOST as string,
  };

  const RedisStore = connectRedis(session);

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET as string || TEST_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }
    })
  );

  server.express.get("/confirm/:id", confirmEmail);


  await createTypeormConnection();

  const port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  const app = await server.start({
    cors,
    port,
  });
  console.log('Server is running on localhost:4000');

  return app;
};
