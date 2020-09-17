import {Request, Response} from "express"
import { ImageBusiness } from "../business/ImageBusiness"
import { ImageDatabase } from "../data/ImageDatabase"
import { CreateImageDTO } from "../models/Image"
import { IdGenerator } from "../services/IdGenerator"
import { TokenGenerator } from "../services/TokenGenerator"

export class ImageController {
  private static imageBusiness = new ImageBusiness(
    new ImageDatabase(),
    new IdGenerator(),
    new TokenGenerator()
  ) 

  async createImage(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string
      const {subtitle, file, tags, collection} = req.body
  
      const newImage: CreateImageDTO = {
        subtitle,
        file,
        tags,
        collection
      }
      
      await ImageController.imageBusiness.createImage(newImage, token)

      res.status(200).send({message: "Image saved successfully"})
    } catch (error) {
      res.status(400).send({error: error.message})
    }
  }

  async getAllImages(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string
  
      const allImages = await ImageController.imageBusiness.getAllImages(token)
      res.status(200).send(allImages)
    } catch (error) {
      res.status(400).send({error: error.message})
    }

  }
}