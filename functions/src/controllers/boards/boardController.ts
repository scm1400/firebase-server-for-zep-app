import { Request, Response } from "express";
import { fireStorage, firestore, FieldValue } from "../../firebase";
import * as multer from "multer";
import * as path from "path";

const upload = multer({ storage: multer.memoryStorage() });
interface MulterRequest extends Request {
	file?: Express.Multer.File;
}

export const searchPosts = async (req: Request, res: Response) => {
	try {
		const { query } = req.body;
		const postsSnapshot = await firestore.collection("posts").where("content", "array-contains", query).get();
		const posts = postsSnapshot.docs.map((doc) => doc.data());
		res.status(200).send(posts);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const getPostsByAuthor = async (req: Request, res: Response) => {
	try {
		const { authorId } = req.params;
		const postsSnapshot = await firestore.collection("posts").where("authorId", "==", authorId).get();
		const posts = postsSnapshot.docs.map((doc) => doc.data());
		res.status(200).send(posts);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const getPostsByHashtag = async (req: Request, res: Response) => {
	try {
		const { hashtag } = req.params;
		const postsSnapshot = await firestore.collection("posts").where("hashtags", "array-contains", hashtag).get();
		const posts = postsSnapshot.docs.map((doc) => doc.data());
		res.status(200).send(posts);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const createPost = async (req: Request, res: Response) => {
	try {
		const { authorId, content, hashtags } = req.body;
		const newPost = { authorId, content, hashtags, createdAt: FieldValue.serverTimestamp(), likes: 0 };
		const postRef = await firestore.collection("posts").add(newPost);
		res.status(201).send(`Post created with ID: ${postRef.id}`);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const likePost = async (req: Request, res: Response) => {
	try {
		const { postId } = req.params;
		const postRef = firestore.collection("posts").doc(postId);
		await postRef.update({ likes: FieldValue.increment(1) });
		res.status(200).send("Post liked successfully");
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const commentOnPost = async (req: Request, res: Response) => {
	try {
		const { postId, authorId, content } = req.body;
		const newComment = { authorId, content, createdAt: FieldValue.serverTimestamp() };
		await firestore.collection("posts").doc(postId).collection("comments").add(newComment);
		res.status(201).send("Comment added successfully");
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const replyToComment = async (req: Request, res: Response) => {
	try {
		const { postId, commentId, authorId, content } = req.body;
		const newReply = { authorId, content, createdAt: FieldValue.serverTimestamp() };
		await firestore.collection("posts").doc(postId).collection("comments").doc(commentId).collection("replies").add(newReply);
		res.status(201).send("Reply added successfully");
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).send(error.message);
		} else {
			res.status(500).send("Unknown error occurred");
		}
	}
};

export const uploadImage = [
	upload.single("image"),
	async (req: MulterRequest, res: Response) => {
		try {
			if (!req.file) {
				return res.status(400).send("No image file provided");
			}

			const fileName = `${Date.now()}_${path.basename(req.file.originalname)}`;
			const file = fireStorage.file(fileName);

			await file.save(req.file.buffer, {
				metadata: { contentType: req.file.mimetype },
			});

			const fileUrl = `https://storage.googleapis.com/${fireStorage.name}/${fileName}`;
			return res.status(200).send({ url: fileUrl });
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).send(error.message);
			} else {
				return res.status(500).send("Unknown error occurred");
			}
		}
	},
];

export const uploadFile = [
	upload.single("file"),
	async (req: MulterRequest, res: Response) => {
		try {
			if (!req.file) {
				return res.status(400).send("No file provided");
			}

			const fileName = `${Date.now()}_${path.basename(req.file.originalname)}`;
			const file = fireStorage.file(fileName);

			await file.save(req.file.buffer, {
				metadata: { contentType: req.file.mimetype },
			});

			const fileUrl = `https://storage.googleapis.com/${fireStorage.name}/${fileName}`;
			return res.status(200).send({ url: fileUrl });
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).send(error.message);
			} else {
				return res.status(500).send("Unknown error occurred");
			}
		}
	},
];
