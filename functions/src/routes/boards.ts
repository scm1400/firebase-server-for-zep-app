import { Router } from "express";
import { searchPosts, getPostsByAuthor, getPostsByHashtag, createPost, likePost, commentOnPost, replyToComment, uploadImage, uploadFile } from "../controllers/boards/boardController";

const router = Router();

router.post("/searchPosts", searchPosts);
router.get("/getPostsByAuthor/:authorId", getPostsByAuthor);
router.get("/getPostsByHashtag/:hashtag", getPostsByHashtag);
router.post("/createPost", createPost);
router.post("/likePost/:postId", likePost);
router.post("/commentOnPost", commentOnPost);
router.post("/replyToComment", replyToComment);
router.post("/uploadImage", uploadImage);
router.post("/uploadFile", uploadFile);

export default router;
