module.exports = (app) => {
    
    app.command('/approval-test', async ({ ack, body, client, logger }) => {
      
      await ack();
  
      logger.info(`User ${body.user_id} triggered /approval-test`);
  
      try {
       
        const result = await client.views.open({
          
          trigger_id: body.trigger_id,
          
          view: {
            type: 'modal',
            
            callback_id: 'approval_modal',
            title: {
              type: 'plain_text',
              text: 'Request Approval'
            },
            blocks: [
              // Dropdown for selecting the approver
              {
                type: 'input',
                block_id: 'approver_block', 
                label: {
                  type: 'plain_text',
                  text: 'Select Approver'
                },
                element: {
                  type: 'users_select', 
                  placeholder: {
                    type: 'plain_text',
                    text: 'Select a user'
                  },
                  action_id: 'approver_select'
                }
              },
              // Text area for the approval reason
              {
                type: 'input',
                block_id: 'reason_block', 
                label: {
                  type: 'plain_text',
                  text: 'Reason for Approval'
                },
                element: {
                  type: 'plain_text_input',
                  multiline: true, 
                  action_id: 'approval_text' 
                },
                hint: { // Optional hint text
                   type: 'plain_text',
                   text: 'Please provide details about your request.'
                }
              }
            ],
            submit: {
              type: 'plain_text',
              text: 'Submit Request'
            }
          }
        });
        logger.info('Modal opened successfully:', result.ok);
  
      } catch (error) {
        logger.error('Error opening modal:', error);
        
        try {
            await client.chat.postEphemeral({
                channel: body.channel_id,
                user: body.user_id,
                text: `Sorry, something went wrong when trying to open the approval form: ${error.message}`
            });
        } catch (ephemeralError) {
            logger.error('Error sending ephemeral message:', ephemeralError);
        }
      }
    });
  
   
  };