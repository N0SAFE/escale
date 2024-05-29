import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FileRessourcePatchBodyDto {}

export class FileRessourcePatchQueryDto {}

export class FileRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePatchBodyDto)
  public body: FileRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePatchQueryDto)
  public query: FileRessourcePatchQueryDto

  public get after() {
    return new FileRessourcePatchDtoAfter(this)
  }
}

export class FileRessourcePatchBodyDtoAfter
  implements AsSameProperties<FileRessourcePatchBodyDto> {}

export class FileRessourcePatchQueryDtoAfter
  implements AsSameProperties<FileRessourcePatchQueryDto> {}

export class FileRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePatchBodyDtoAfter)
  public body: FileRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePatchQueryDtoAfter)
  public query: FileRessourcePatchQueryDtoAfter
}
