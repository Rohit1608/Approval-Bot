// listeners/views.js

module.exports = (app) => {
    
    app.view('approval_modal', async ({ ack, body, view, client, logger }) => {
      
      await ack();
  
      
      const requester = body.user; 
      const stateValues = view.state.values; 
  
      
      const findValue = (blockId, actionId) => {
          const block = stateValues[blockId];
          if (block && block[actionId]){
             return block[actionId];
          }
          // Fallback if block_id wasn't explicitly set 
          for (const blockKey in stateValues){
             if (stateValues[blockKey][actionId]){
                return stateValues[blockKey][actionId];
             }
          }
          return null;
      }
  
      const approverSelectData = findValue('approver_block', 'approver_select');
      const approvalTextData = findValue('reason_block', 'approval_text');
  
      const approverId = approverSelectData?.selected_user;
      const approvalText = approvalTextData?.value;
  
      if (!approverId || approvalText === undefined) {
          logger.error('Failed to extract approver or approval text from modal submission:', view.state.values);
          try {
               await client.chat.postMessage({
                   channel: requester.id,
                   text: 'Sorry, there was an error processing your submission. Required fields might be missing.'
               });
          } catch (postError) {
               logger.error('Failed to send error message to requester:', postError);
          }
          return;
      }
  
      logger.info(`User ${requester.id} submitted approval request for approver ${approverId} with text: ${approvalText}`);
  
      // Preparing the message for the approver
      
      const messageText = `<@${requester.id}> has requested your approval for the following:\n\n>${approvalText}`;
  
      try {
        // Sending message to the selected approver 
        const msgResult = await client.chat.postMessage({
          channel: approverId,
          text: messageText,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: messageText
              }
            },
            {
              type: 'actions',
              block_id: 'approval_actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Approve', emoji: true },
                  style: 'primary',
                  action_id: 'approve_request',
                  value: requester.id
                },
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Reject', emoji: true },
                  style: 'danger',
                  action_id: 'reject_request',
                  value: requester.id
                }
              ]
            }
          ]
        });
        logger.info('Approval request message sent successfully:', msgResult.ok);
  
         try {
             await client.chat.postMessage({
                 channel: requester.id,
                 text: `Your approval request has been sent to <@${approverId}>.`
             });
             logger.info(`Confirmation sent to requester ${requester.id}`);
         } catch (confirmError) {
             logger.error('Failed to send confirmation message to requester:', confirmError);
         }
  
      } catch (error) {
        logger.error('Error sending approval request message:', error);
         try {
               await client.chat.postMessage({
                   channel: requester.id,
                   text: `Sorry, there was an error sending your request to the approver: ${error.message}`
               });
         } catch (postError) {
               logger.error('Failed to send error message to requester:', postError);
         }
      }
    });
  
    
  };