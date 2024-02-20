export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<UploadFile.OutPut>
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type OutPut = string
}
