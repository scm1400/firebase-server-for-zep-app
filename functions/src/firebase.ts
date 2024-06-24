import * as admin from 'firebase-admin';

let app: admin.app.App;

if (admin.apps.length === 0) {
    app = admin.initializeApp();
} else {
    app = admin.app();
}

const firestore = app.firestore();
const FieldValue = admin.firestore.FieldValue;
const fireStorage = app.storage().bucket();

export { admin, firestore, fireStorage, FieldValue };
export default app;
