import request from "graphql-request";

import { HOST } from "../constatns";
import { User } from "../entity/User";
import { createTypeormConnection } from "../utils/utils";
import { startServer } from "../startServer";
import { AddressInfo } from "net";

const email = 'v@v.v';
const password = 'rrrrrr';

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});

test('register user resolver mutation', async () => {
  const response = await request(getHost(), mutation);

  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email }});
  console.log('USERS', users);
  expect(users.length).toBe(3);
  expect(users[0].email).toBe(email);
  expect(users[0].password).not.toBe(password);
});
