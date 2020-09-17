import { Tag } from "../models/Tag";
import { BaseDataBase } from "./BaseDatabase";

export class TagDatabase extends BaseDataBase {
  tableTags = "MyFrames_Tags"
  tableTags_Image = "MyFrames_Image_Tag"

  async createTag(tag: Tag): Promise<void> {
    try {
      await this.getConnection().insert({
        id: tag.getId(),
        name: tag.getName()
      }).into(this.tableTags)
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async tagNameExists(name: string): Promise<boolean> {
    try {
      const result = await this.getConnection().raw(`
        SELECT * FROM ${this.tableTags}
        WHERE name = "${name}"
      `)
      if(!result[0][0]) {
        return false
      } else {
        return true
      }
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getTagById(id: string): Promise<Tag> {
    try {
      const tag = await this.getConnection().raw(`
        SELECT * FROM ${this.tableTags}
        WHERE id = "${id}"
      `)
      return Tag.toTagModel(tag[0][0])
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getTagByName(name: string): Promise<Tag> {
    try {
      const tag = await this.getConnection().raw(`
        SELECT * FROM ${this.tableTags}
        WHERE name = "${name}"
      `)
      return Tag.toTagModel(tag[0][0])
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async linkTagToImage(linkTagImage: LinkTagImage): Promise<void> {
    try {
      await this.getConnection().insert({
        tag_id: linkTagImage.tagId,
        image_id: linkTagImage.imageId
      }).into(this.tableTags_Image)
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }

  async getTagsByImageId(id: string): Promise<Tag[]> {
    try {
      const tags = await this.getConnection().raw(`
        SELECT tg.name, tg.id
        FROM MyFrames_Tags tg
        JOIN MyFrames_Image_Tag itg
        ON tg.id = itg.tag_id
        WHERE itg.image_id = "${id}"
      `)
      const tagsArray: Tag[] = []
      tags[0].map((tag: Tag) => {
        tagsArray.push(Tag.toTagModel(tag))
      })
      console.log(tags[0])
      return tagsArray
    } catch (error) {
      throw new Error(error.sqlmessage || error.message)
    }
  }
}
  
export interface LinkTagImage {
  tagId: string,
  imageId: string
}