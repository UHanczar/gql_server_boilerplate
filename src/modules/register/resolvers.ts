import * as bcrypt from 'bcryptjs';
import { ValidationError } from "yup";

import { ResolverMap } from "../../types/graphql-util";
import {User} from "../../entity/User";
import { checkRegisterSchemaParams } from "../../utils/checkRegisterSchemaParams";
import { formatYupError } from "../../utils/format-yup-error";
import { duplicatedEmail } from "./registerErrorMessages";
import {createConfirmEmailLink} from "../../utils/createConfirmEmailLink";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";

export const resolvers: ResolverMap = {
  Query: {
    users: async () => await User.find(),
  },

  Mutation: {
    register: async (_: any, args: GQL.IRegisterOnMutationArguments, { redis, url }) => {
      try {
        await checkRegisterSchemaParams.validate(args, { abortEarly: false });
      } catch (error) {
        return formatYupError(error);
      }
      
      const { email, password } = args;
      const createdUserId = await User.findOne({ where: { email }, select: ['id']});

      if (createdUserId) {
        return [{
          path: 'email',
          message: duplicatedEmail,
        }];
      }

      const hashedPassword = await bcrypt.hash(password as string, 10);

      const user = await User.create({
        email: email as string,
        password: hashedPassword,
      });

      await user.save();

      const link = await createConfirmEmailLink(url, user.id, redis);

      if (process.env.NODE_ENV !== "test") {
        await sendVerificationEmail(email as string, link);
      }

      return null;
    },

    deleteUser: async (_: any, { id }: GQL.IDeleteUserOnMutationArguments) => {
      const user = await User.findOne({ id: id });

      if (!user) {
        return false;
      }

      await user.remove();

      return true;
    },
  }
};
