# Slack Approval Bot

A Slack bot that facilitates approval workflows by allowing users to request approvals from team members.

## Features

- Request approvals via `/approval-test` command
- Select an approver from workspace members
- Add detailed request description
- Instant notifications for requesters and approvers
- One-click approve/reject actions
- Status updates for all parties involved

## Installation

1. Clone the repository
2. Install dependencies:
```sh
npm install
```
3. Create a `.env` file with your Slack credentials:
```env
SLACK_BOT_TOKEN=your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
PORT=3000
```

## Configuration

1. Create a Slack App in your workspace
2. Enable Socket Mode
3. Add the following bot token scopes:
   - `chat:write`
   - `commands`
   - `users:read`
4. Install the app to your workspace

## Usage

1. Start the bot:
```sh
node app.js
```

2. In Slack, use the `/approval-test` command to create a new approval request
3. Select an approver and enter request details
4. The approver will receive a message with Approve/Reject buttons
5. Both parties will be notified of the final decision

## Project Structure

```
approval-bot/
├── app.js             # Main application entry point
├── .env              # Environment variables
└── listeners/        # Event listeners
    ├── actions.js    # Button click handlers
    ├── commands.js   # Slash command handlers
    └── views.js      # Modal view handlers
```


