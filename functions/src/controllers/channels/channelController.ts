import { Request, Response } from "express";
import { firestore } from "../../firebase";

export const setOnlineUsers = async (req: Request, res: Response) => {
	try {
		const { gameId, channelId, onlineUsers } = req.body;
		const channelData = { onlineUsers };
		await firestore.collection("games").doc(gameId).collection("channels").doc(channelId).set(channelData);
		res.status(200).send("Online users count set successfully");
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const getOnlineUsers = async (req: Request, res: Response) => {
	try {
		const { gameId, channelId } = req.params;
		const doc = await firestore.collection("games").doc(gameId).collection("channels").doc(channelId).get();
		if (!doc.exists) {
			res.status(404).send("No such document!");
		} else {
			res.status(200).send(doc.data());
		}
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const getAllOnlineUsers = async (req: Request, res: Response) => {
	try {
		const gamesSnapshot = await firestore.collection("games").listDocuments();
		const result: { [key: string]: { [key: string]: { onlineUsers: number } } } = {};

		for (const gameDoc of gamesSnapshot) {
			const gameId = gameDoc.id;
			const channelsSnapshot = await firestore.collection("games").doc(gameId).collection("channels").listDocuments();
			result[gameId] = {};

			for (const channelDoc of channelsSnapshot) {
				result[gameId][channelDoc.id] = (await channelDoc.get()).data() as { onlineUsers: number };
			}
		}

		res.status(200).send(result);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};
