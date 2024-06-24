import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors({ origin: true }));

// REST API 엔드포인트 설정
app.use("/", routes);

// Cloud Function에 Express 앱을 연결
exports.api = functions.https.onRequest(app);
