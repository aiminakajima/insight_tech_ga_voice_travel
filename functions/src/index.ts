import * as functions from 'firebase-functions';
import * as intents from './intents';
import * as collect_data from './collect_data';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.conversationFulfillment
    = functions.region('asia-northeast1').https.onRequest(intents.getDialogflowApp());
exports.collectComplaint
    = functions.region('asia-northeast1').https.onRequest(collect_data.collect);
