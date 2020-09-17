import express from "express"
import { ImageController } from "../controllers/ImageController"

export const imageRouter = express.Router()

imageRouter.post('/post-image', new ImageController().createImage)
imageRouter.get('/all-images', new ImageController().getAllImages)