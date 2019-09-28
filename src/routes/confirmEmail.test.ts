import fetch from "node-fetch";

test('it should send back massage about invalid link', async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/12083`);
  const text = await response.text();

  expect(text).toEqual("invalid");
});
