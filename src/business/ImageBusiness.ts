import moment from "moment";
import { ImageDatabase } from "../data/ImageDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { CreateImageDTO, Image, LinkTagImage, Tag } from "../models/Image";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";

export class ImageBusiness {
  constructor(
    private imageDatabase: ImageDatabase,
    private idGenerator: IdGenerator,
    private tokenGenerator: TokenGenerator
  ){}

  async createImage(image: CreateImageDTO, token: string): Promise<void> {
    try {
      const authorId = await this.tokenGenerator.verify(token)
      const author = await new UserDatabase().getUserById(authorId)
      const imageId = this.idGenerator.generate()
      const date = moment().format('YYYY/MM/DDTHH:mm:ss')
  
      const newImage = new Image(
        imageId,
        image.subtitle,
        author,
        date,
        image.file,
        image.tags,
        image.collection
      )

      await this.imageDatabase.createImage(newImage)
        
      await Promise.all(newImage.getTags().map(async (tagName) => {
        let imageTag = await this.imageDatabase.getTagByName(tagName)
        let tagExists = true
        console.log(imageTag)
        if(!imageTag) {
          tagExists = false
          const newTag: Tag = {
            id: this.idGenerator.generate(),
            name: tagName
          }
          await this.imageDatabase.createTag(newTag)
        }
        if(tagExists === false) {
          imageTag = await this.imageDatabase.getTagByName(tagName)
        }
        const linkTagImageIds: LinkTagImage = {
          imageId: newImage.getId(),
          tagId: imageTag.id
        }
        await this.imageDatabase.linkTagToImage(linkTagImageIds)
      }))
  
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getAllImages(token: string) {
    try {
      await this.tokenGenerator.verify(token)
  
      const allImages = await this.imageDatabase.getAllImages()

      return allImages
    } catch (error) {
      throw new Error(error.message)
    }
  }
}