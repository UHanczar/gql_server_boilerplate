import axios from 'axios';

import { createTypeormConnection } from "../../utils/defineDatabase";
import { User } from "../../entity/User";
import { Connection } from "typeorm";

let connection: Connection;
const email = 'new-email@email.com';
const password = '1345566433';

const loginMutation = (email: string, password: string) => `
  mutation {
    login(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const meQuery = `
  {
    me {
      id,
      email
    }
  }
`;

describe('me query should work', () => {
  beforeAll(async () => {
    connection = await createTypeormConnection();

    const user = await User
      .create({
        email,
        password,
        confirmed: true,
      })
      .save();
  });

  afterAll(async () => {
    connection.close();
  });

  test('should return logged user', async () => {
    const result = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery,
      },
      {
        withCredentials: true,
      }
    );

    expect(result.data.data.me).toBe(null);
  });
});
