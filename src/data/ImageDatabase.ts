import { Image } from "../models/Image";
import { BaseDataBase } from "./BaseDatabase";

export class ImageDatabase extends BaseDataBase {
  tableImage = "MyFrames_Image"
  
  async createImage(image: Image): Promise<void> {
    try {
      await this.getConnection().insert({
        id: image.getId(),
        subtitle: image.getSubtitle(),
        author: image.getAuthor().getName(),
        author_id: image.getAuthor().getId(),
        date: image.getDate(),
        file: image.getFile(),
        collection: image.getCollection()
      }).into(this.tableImage)
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getAllImages(): Promise<Image[]> {
    try {
      const images = await this.getConnection().raw(`
        SELECT id, subtitle, author, author_id, date, file,
        collection 
        FROM MyFrames_Image;
      `)
      const imagesArray: Image[] = []
      await Promise.all(images[0].map(async (image: any) => {
        imagesArray.push(await Image.toImageModel(image))
      }))
      return imagesArray
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getImageById(id: string): Promise<Image> {
    try {
      const image = await this.getConnection().raw(`
        SELECT id, subtitle, author, author_id, date, file,
        collection 
        FROM MyFrames_Image
        WHERE id = "${id}"
      `)
      return Image.toImageModel(image[0][0])
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }
}