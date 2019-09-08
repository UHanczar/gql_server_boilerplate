import * as bcrypt from 'bcryptjs';

import {ResolverMap} from "./types/graphql-util";
import {User} from "./entity/User";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
    users: async () => User.find(),
  },

  Mutation: {
    register: async (_: any, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const hashedPassword = await bcrypt.hash(password as string, 10);

      const user = await User.create({
        email: email as string,
        password: hashedPassword,
      });

      await user.save();
      return true;
    },
  }
};
