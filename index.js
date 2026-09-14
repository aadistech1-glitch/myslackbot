const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/athl-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/athl-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Available Commands:
/athl-ping - Check bot latency
/athl-catfact - Get a cat fact
/athl-dogfact - Get a dog fact
/athl-joke - Get a dad joke`,
  });
});
.#here i have added dadjokes and dog facts that are not listed on the gude....
app.command("/athl-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/athl-dogfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://dog-api.kinduff.com/api/facts");
    const fact = response.data[0]?.fact || "No dog fact available right now.";
    await respond({ text: `Dog Fact:\n${fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a dog fact." });
  }
});

app.command("/athl-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });

    await respond({ text: `Dad Joke:\n${response.data.joke}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a dad joke." });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
