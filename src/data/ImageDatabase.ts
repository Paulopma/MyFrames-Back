import moment from "moment";
import { Image, LinkTagImage, Tag } from "../models/Image";
import { BaseDataBase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class ImageDatabase extends BaseDataBase {
  tableImage = "MyFrames_Image"
  tableTags = "MyFrames_Tags"
  tableTags_Image = "MyFrames_Image_Tag"
  
  async createImage(image: Image) {
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

  async createTag(tag: Tag) {
    try {
      await this.getConnection().insert({
        id: tag.id,
        name: tag.name
      }).into(this.tableTags)
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getTagById(id: string) {
    try {
      const tag = await this.getConnection().raw(`
        SELECT * FROM ${this.tableTags}
        WHERE id = "${id}"
      `)
      return tag[0][0]
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }
  
  async getTagByName(name: string) {
    try {
      const tag = await this.getConnection().raw(`
        SELECT * FROM ${this.tableTags}
        WHERE name = "${name}"
      `)
      return tag[0][0]
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async linkTagToImage(linkTagImage: LinkTagImage) {
    try {
      await this.getConnection().insert({
        tag_id: linkTagImage.tagId,
        image_id: linkTagImage.imageId
      }).into(this.tableTags_Image)
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getTagsByImageId(id: string) {
    const tags = await this.getConnection().raw(`
      SELECT tg.name as tag_name, tg.id as tag_id
      FROM MyFrames_Tags tg
      JOIN MyFrames_Image_Tag itg
      ON tg.id = itg.tag_id
      WHERE itg.image_id = "${id}"
    `)
    return tags[0]
  }

  async getAllImages() {
    try {
      const images = await this.getConnection().raw(`
        SELECT im.id as image_id, subtitle, author, author_id, date, file,
        collection 
        FROM MyFrames_Image im;
      `)
      const imagesArray: Image[] = []
      await Promise.all(images[0].map(async (image: any) => {
        imagesArray.push(new Image(
          image.imageId,
          image.subtitle,
          await new UserDatabase().getUserById(image.author_id),
          moment(image.date).format('DD/MM/YYYYTHH:mm:ss'),
          image.file,
          await this.getTagsByImageId(image.image_id),
          image.collection
        ))
        console.log(await this.getTagsByImageId(image.image_id))
      }))
      return imagesArray
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }
}