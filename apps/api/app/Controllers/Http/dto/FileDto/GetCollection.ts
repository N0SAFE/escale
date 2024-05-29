import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FileRessourceGetCollectionBodyDto {}

export class FileRessourceGetCollectionQueryDto {}

export class FileRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetCollectionBodyDto)
  public body: FileRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetCollectionQueryDto)
  public query: FileRessourceGetCollectionQueryDto

  public get after() {
    return new FileRessourceGetCollectionDtoAfter(this)
  }
}

export class FileRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<FileRessourceGetCollectionBodyDto> {}

export class FileRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<FileRessourceGetCollectionQueryDto> {}

export class FileRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetCollectionBodyDtoAfter)
  public body: FileRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetCollectionQueryDtoAfter)
  public query: FileRessourceGetCollectionQueryDtoAfter
}
