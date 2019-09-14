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

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});

test('register user resolver mutation', async () => {
  // test if we can register a user
  const response = await request(getHost(), mutation(userEmail, userPassword));
  expect(response).toEqual({ register: null });

  const users = await User.find({ where: { email: userEmail }});

  expect(users.length).toBe(1);
  expect(users[0].email).toBe(userEmail);
  expect(users[0].password).not.toBe(userPassword);

  // test error user email duplication
  const duplicateEmailResponse = await request(getHost(), mutation(userEmail, userPassword));
  expect(duplicateEmailResponse).toEqual({ register: [{
    path: 'email',
    message: duplicatedEmail,
  }]});

  // catch bad email
  const wrongEmailResponse = await request(getHost(), mutation('teeee', 'bnbbeb'));
  expect(wrongEmailResponse).toEqual({ register: [{
      path: 'email',
      message: notValidEmail,
    }]});

  // catch not valid password
  const notValidPasswordResponse = await request(getHost(), mutation('teeee@t.t', 'bn'));
  expect(notValidPasswordResponse).toEqual({ register: [{
      path: 'password',
      message: notValidPassword,
    }]});

  // catch not valid email and password
  const notValidEmailAndPasswordResponse = await request(getHost(), mutation('t', 'bn'));
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
