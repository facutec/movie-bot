const dialogflow = require('@google-cloud/dialogflow');
const { projectId, credentials } = require('../config/dialogFlowConfig');

const sessionClient = new dialogflow.SessionsClient({ credentials });

async function sendToDialogflow(queryText, sessionId) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: 'es-ES',
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    return responses[0].queryResult;
}

module.exports = sendToDialogflow;
