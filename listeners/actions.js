module.exports = (app) => {
    // Approve (button click)
    app.action('approve_request', async ({ ack, body, client, logger, action }) => {
      await ack();
  
      const approver = body.user;
      const requesterId = action.value;
  
      logger.info(`Approve button clicked by ${approver.id} for request from ${requesterId}`);
  
      const channelId = body.channel.id;
      const messageTs = body.message.ts;
      const originalBlocks = body.message.blocks;
  
      const updatedBlocks = [
          originalBlocks[0],
          {
              type: 'context',
              elements: [ { type: 'mrkdwn', text: `:white_check_mark: Approved by <@${approver.id}>` } ]
          }
      ];
  
      try {
        await client.chat.update({
          channel: channelId,
          ts: messageTs,
          text: `Approval request approved by <@${approver.id}>`,
          blocks: updatedBlocks
        });
        logger.info(`Original message updated for approver ${approver.id}`);
  
        await client.chat.postMessage({
          channel: requesterId,
          text: `Good news! Your approval request was approved by <@${approver.id}>.`
        });
        logger.info(`Approval notification sent to requester ${requesterId}`);
  
      } catch (error) {
        logger.error('Error handling approval action:', error);
      }
    });
  
    // Reject (button click)
    app.action('reject_request', async ({ ack, body, client, logger, action }) => {
      await ack();
  
      const rejector = body.user;
      const requesterId = action.value;
  
      logger.info(`Reject button clicked by ${rejector.id} for request from ${requesterId}`);
  
      const channelId = body.channel.id;
      const messageTs = body.message.ts;
      const originalBlocks = body.message.blocks;
  
      const updatedBlocks = [
          originalBlocks[0],
          {
              type: 'context',
              elements: [ { type: 'mrkdwn', text: `:x: Rejected by <@${rejector.id}>` } ]
          }
      ];
  
      try {
        await client.chat.update({
         channel: channelId,
         ts: messageTs,
         text: `Approval request rejected by <@${rejector.id}>`,
         blocks: updatedBlocks
       });
       logger.info(`Original message updated for rejector ${rejector.id}`);
  
       await client.chat.postMessage({
         channel: requesterId,
         text: `Unfortunately, your approval request was rejected by <@${rejector.id}>.`
       });
       logger.info(`Rejection notification sent to requester ${requesterId}`);
  
      } catch (error) {
        logger.error('Error handling rejection action:', error);
      }
    });
  
    
  };