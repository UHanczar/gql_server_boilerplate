import * as bcrypt from 'bcryptjs';

import {ResolverMap} from "../../types/graphql-util";
import {User} from "../../entity/User";

export const resolvers: ResolverMap = {
  Query: {
    users: async () => await User.find(),
  },

  Mutation: {
    register: async (_: any, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const createdUserId = await User.findOne({ where: { email }, select: ['id']});

      if (createdUserId) {
        return [{
          path: 'email',
          message: 'User with this email already exists',
        }];
      }

      const hashedPassword = await bcrypt.hash(password as string, 10);

      const user = await User.create({
        email: email as string,
        password: hashedPassword,
      });

      await user.save();
      return null;
    },
  }
};
