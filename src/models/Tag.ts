export class Tag {
  constructor (
    private id: string,
    private name: string
  ){}

  getId(): string {return this.id}
  getName(): string {return this.name}

  static toTagModel(tag: Tag) {
    return new Tag(
      tag.id,
      tag.name
    )
  }
}