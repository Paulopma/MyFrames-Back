import moment from "moment";
import { ImageDatabase } from "../data/ImageDatabase";
import { LinkTagImage, TagDatabase } from "../data/TagDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { CreateImageDTO, Image} from "../models/Image";
import { Tag } from "../models/Tag";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";

export class ImageBusiness {
  constructor(
    private imageDatabase: ImageDatabase,
    private tagDatabase: TagDatabase,
    private idGenerator: IdGenerator,
    private tokenGenerator: TokenGenerator
  ){}

  async createImage(image: CreateImageDTO, token: string): Promise<void> {
    try {
      const authorId = await this.tokenGenerator.verify(token)
      const author = await new UserDatabase().getUserById(authorId)
      const imageId = this.idGenerator.generate()
      const date = moment().format('YYYY/MM/DDTHH:mm:ss')
      const tags: Tag[] = []

      await Promise.all(image.tags.map(async (tag) => {
        const tagExists = await this.tagDatabase.tagNameExists(tag)
        console.log(tagExists)
        if(!tagExists) {
          const newTag: Tag = new Tag(
            this.idGenerator.generate(),
            tag
          )
          await this.tagDatabase.createTag(newTag)
        }
        let imageTag = await this.tagDatabase.getTagByName(tag)
        console.log(imageTag)
        tags.push(imageTag)
      }))

      const newImage = new Image(
        imageId,
        image.subtitle,
        author,
        date,
        image.file,
        tags,
        image.collection
      )

      await this.imageDatabase.createImage(newImage)
      console.log(tags)

      await Promise.all(tags.map(async (tag) => {
        const linkTagImageIds: LinkTagImage = {
          imageId,
          tagId: tag.getId()
        }
        await this.tagDatabase.linkTagToImage(linkTagImageIds)
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

  async getImageById(id: string, token: string) {
    try {
      await this.tokenGenerator.verify(token)
      console.log(id)

      const image = await this.imageDatabase.getImageById(id)

      return image
    } catch (error) {
      throw new Error(error.message)
    }
  }
}