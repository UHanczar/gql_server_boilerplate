import request from "graphql-request";

import { User } from "../../entity/User";
import { createTypeormConnection } from "../../utils/utils";
import { startServer } from "../../startServer";
import { AddressInfo } from "net";

const email = 'y@y.y';
const password = 'ttttttt';

const mutation = `
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
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });

  const users = await User.find({ where: { email }});

  expect(users.length).toBe(1);
  expect(users[0].email).toBe(email);
  expect(users[0].password).not.toBe(password);

  const response2 = await request(getHost(), mutation);
  expect(response2).toEqual({ register: [{
    path: 'email',
    message: 'User with this email already exists',
  }]});
});
