import * as bcrypt from 'bcryptjs';

import { ResolverMap } from "../../types/graphql-util";
import {User} from "../../entity/User";
import { emailNotConfirmed, invalidLogin } from "./errorMessages";

export const resolvers: ResolverMap = {
  Query: {
    loginDefault: () => 'Default login query works',
  },

  Mutation: {
    login: async (_: any, { email, password }: GQL.ILoginOnMutationArguments, { session }) => {
      const user = await User.findOne({ where: { email }});

      if (!user) {
        return [{
          path: 'Login',
          message: invalidLogin,
        }];
      }

      if (!user.confirmed) {
        return [{
          path: 'Login',
          message: emailNotConfirmed,
        }];
      }

      const validPassword = await bcrypt.compare(password as string, user.password);

      if (!validPassword) {
        return [{
          path: 'Login',
          message: invalidLogin,
        }];
      }

      session.userId = user.id;

      return null;
    },
  }
};
