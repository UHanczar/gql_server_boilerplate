import request from "graphql-request";

import { User } from "../../entity/User";
import { createTypeormConnection } from "../../utils/defineDatabase";
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import {duplicatedEmail, notLongEmail, notValidEmail, notValidPassword} from "./registerErrorMessages";

const userEmail = `n@i${Math.random()}y.n`;
const userPassword = 'ttttttt';

const mutation = (email: string, password: string) => `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

// let getHost = () => '';

describe('register user resolver mutation', () => {
  beforeAll(async () => {
    await createTypeormConnection();
  });

  test('should test user registration', async () => {
    // test if we can register a user
    const response = await request(process.env.TEST_HOST as string, mutation(userEmail, userPassword));
    expect(response).toEqual({ register: null });

    const users = await User.find({ where: { email: userEmail }});

    expect(users.length).toBe(1);
    expect(users[0].email).toBe(userEmail);
    expect(users[0].password).not.toBe(userPassword);
  });

  test('should check invalid email', async () => {
    const wrongEmailResponse = await request(process.env.TEST_HOST as string, mutation('teeee', 'bnbbeb'));
    expect(wrongEmailResponse).toEqual({ register: [{
        path: 'email',
        message: notValidEmail,
      }]});
  });

  test('should check invalid password', async () => {
    const notValidPasswordResponse = await request(process.env.TEST_HOST as string, mutation('teeee@t.t', 'bn'));
    expect(notValidPasswordResponse).toEqual({ register: [{
        path: 'password',
        message: notValidPassword,
      }]});
  });

  test('should throw error on invalid login inputs', async () => {
    // catch not valid email and password
    const notValidEmailAndPasswordResponse = await request(process.env.TEST_HOST as string, mutation('t', 'bn'));
    expect(notValidEmailAndPasswordResponse).toEqual({ register: [
        {
          path: 'email',
          message: notLongEmail,
        },
        {
          path: 'email',
          message: notValidEmail,
        },
        {
          path: 'password',
          message: notValidPassword,
        },
      ]});
  });
});
