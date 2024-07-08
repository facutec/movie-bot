const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = JSON.parse(process.env.DIALOGFLOW_SERVICE_ACCOUNT);

module.exports = {
    projectId: serviceAccount.project_id,
    credentials: {
        private_key: serviceAccount.private_key,
        client_email: serviceAccount.client_email,
    }
};
