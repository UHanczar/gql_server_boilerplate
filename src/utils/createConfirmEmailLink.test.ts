import * as Redis from "ioredis";
import fetch from "node-fetch";
import { Connection } from "typeorm";

import { createTypeormConnection } from "./defineDatabase";
import { User } from "../entity/User";

let userId = '';
let connection: Connection;
const redis = new Redis();

describe('Redis confirm email link tests', () => {

  beforeAll(async () => {
    connection = await createTypeormConnection();

    const user = await User
      .create({
        email: 'bob4@bob.com',
        password: 'dogs9jf9fje',
      })
      .save();

    userId = user.id;
  });

  afterAll(async () => {
    await connection.close();
  });

  test('it should send back massage about invalid link', async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/12083`);
    const text = await response.text();

    expect(text).toEqual("invalid");
  });
});
