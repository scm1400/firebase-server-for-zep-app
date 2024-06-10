import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

// Firebase Admin 초기화
admin.initializeApp();

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));


interface ChannelData {
    onlineUsers: number;
}

// REST API 엔드포인트 설정

// 데이터 추가
// 특정 게임의 특정 채널에 유저 수 설정
app.post('/setOnlineUsers', async (req, res) => {
    try {
        const { gameId, channelId, onlineUsers } = req.body;
        const channelData: ChannelData = { onlineUsers };
        await db.collection('games').doc(gameId).collection('channels').doc(channelId).set(channelData);
        res.status(200).send('Online users count set successfully');
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Unknown error occurred');
        }
    }
});

// 특정 게임의 특정 채널의 유저 수 가져오기
app.get('/getOnlineUsers/:gameId/:channelId', async (req, res) => {
    try {
        const { gameId, channelId } = req.params;
        const doc = await db.collection('games').doc(gameId).collection('channels').doc(channelId).get();
        if (!doc.exists) {
            res.status(404).send('No such document!');
        } else {
            res.status(200).send(doc.data());
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Unknown error occurred');
        }
    }
});

// 모든 게임의 채널별 유저 수 가져오기
app.get('/getAllOnlineUsers', async (req, res) => {
    try {
        const gamesSnapshot = await db.collection('games').listDocuments();
        const result: { [key: string]: { [key: string]: ChannelData } } = {};

        for (const gameDoc of gamesSnapshot) {
            const gameId = gameDoc.id;
            const channelsSnapshot = await db.collection('games').doc(gameId).collection('channels').listDocuments();
            result[gameId] = {};

            for (const channelDoc of channelsSnapshot) {
                result[gameId][channelDoc.id] = (await channelDoc.get()).data() as ChannelData;
            }
        }

        res.status(200).send(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('Unknown error occurred');
        }
    }
});

// Cloud Function에 Express 앱을 연결
exports.api = functions.https.onRequest(app);