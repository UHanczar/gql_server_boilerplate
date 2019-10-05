import { request } from 'graphql-request';
import { Connection } from "typeorm";

import { emailNotConfirmed, invalidLogin } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConnection } from "../../utils/defineDatabase";

const userEmail = `n@i${Math.random()}y.n`;
const userPassword = 'ttttttt';
let connection: Connection;

const registerMutation = (email: string, password: string) => `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const loginMutation = (email: string, password: string) => `
  mutation {
    login(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const loginTestWrapper = async (email: string, password: string, result: {path: string, message: string}[] | null) => {
  const response = await request(
    process.env.TEST_HOST as string,
    loginMutation(email, password)
  );

  expect(response.login).toEqual(result);
};

describe('login process', () => {
  beforeAll(async () => {
    await createTypeormConnection();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('should test invalid login', async () => {
    await loginTestWrapper(
      'a@g.b',
      '111',
      [{ path: 'Login', message: invalidLogin }]
    );
  });

  test('should test unconfirmed user login', async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(userEmail, userPassword)
    );

    await loginTestWrapper(
      userEmail,
      userPassword,
      [{ path: 'Login', message: emailNotConfirmed, }]
    );

    await User.update({ email: userEmail }, { confirmed: true });

    await loginTestWrapper(
      userEmail,
      userPassword,
      null
    );
  });
});
