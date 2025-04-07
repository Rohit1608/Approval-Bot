require('dotenv').config();
const { App } = require('@slack/bolt');


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});


const Command = require('./listeners/commands');
const Views = require('./listeners/views');
const Action = require('./listeners/actions');


Command(app);
Views(app);
Action(app);



app.error(async (error) => {
  console.error('Error:', error);

  console.error("Error data:", json.stringify(error.data, null, 2));
});


(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(` App is running on port ${port}`);
})();