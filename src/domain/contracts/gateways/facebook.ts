export interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUser.Input) => Promise<LoadFacebookUser.Output>
}

export namespace LoadFacebookUser {
  export type Input = {
    token: string
  }

  export type Output = undefined | {
    facebookId: string
    name: string
    email: string
  }
}
