import { User } from "./User";

export class Image {
  constructor(
    private id: string,
    private subtitle: string,
    private author: User,
    private date: string,
    private file: string,
    private tags: string[],
    private collection: string
  ) {}

  public getId(): string {
    return this.id
  }

  public setId(id: string): void {
    this.id = id
  }

  public getSubtitle(): string {
    return this.subtitle
  }

  public setSubtitle(subtitle: string,): void {
    this.subtitle = subtitle
  }

  public getAuthor(): User {
    return this.author
  }

  public setAuthor(author: User): void {
    this.author = author
  }

  public getDate(): string {
    return this.date
  }

  public setDate(date: string): void {
    this.date = date
  }

  public getFile(): string {
    return this.file
  }

  public setFile(file: string): void {
    this.file = file
  }

  public getTags(): string[] {
    return this.tags
  }

  public setTags(tags: string[]): void {
    this.tags = tags
  }

  public getCollection(): string {
    return this.collection
  }

  public setCollection(collection: string): void {
    this.collection = collection
  } 

  static toImageModel(image: any) {
    return new Image(
      image.id,
      image.subtitle,
      image.author,
      image.date,
      image.file,
      image.tags,
      image.collection
    )
  }
}

export interface Tag {
  id: string,
  name: string
}

export interface LinkTagImage {
  tagId: string,
  imageId: string
}

export interface CreateImageDTO {
  subtitle: string,
  file: string,
  tags: string[],
  collection: string
}