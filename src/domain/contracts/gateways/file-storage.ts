export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<UploadFile.OutPut>
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type OutPut = string
}

export interface DeleteFile {
  delete: (input: DeleteFile.Input) => Promise<void>
}

namespace DeleteFile {
  export type Input = { key: string }
}
