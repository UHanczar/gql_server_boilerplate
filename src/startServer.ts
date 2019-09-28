import { GraphQLServer } from 'graphql-yoga';

import { redis } from './redis';
import { createTypeormConnection } from "./utils/defineDatabase";
import { confirmEmail } from "./routes/confirmEmail";
import { generateSchema } from "./utils/generateSchema";

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: generateSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host"),
    }),
  });

  server.express.get("/confirm/:id", confirmEmail);


  await createTypeormConnection();

  const port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  const app = await server.start({
    port,
  });
  console.log('Server is running on localhost:4000');

  return app;
};
