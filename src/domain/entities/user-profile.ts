export class UserProfile {
  id: string
  initials?: string
  pictureUrl?: string

  constructor (id: string) {
    this.id = id
  }

  setPicture ({ pictureUrl, name }: { pictureUrl?: string, name?: string }): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined && name !== '') {
      const firstLetters = name.match(/\b(.)/g)!
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift()!.toUpperCase()}${firstLetters.pop()!.toUpperCase()}`
      } else {
        this.initials = name.substring(0, 2)?.toUpperCase()
      }
    }
  }
}
