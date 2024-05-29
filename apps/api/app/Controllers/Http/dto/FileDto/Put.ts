import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FileRessourcePutBodyDto {}

export class FileRessourcePutQueryDto {}

export class FileRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePutBodyDto)
  public body: FileRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePutQueryDto)
  public query: FileRessourcePutQueryDto

  public get after() {
    return new FileRessourcePutDtoAfter(this)
  }
}

export class FileRessourcePutBodyDtoAfter implements AsSameProperties<FileRessourcePutBodyDto> {}

export class FileRessourcePutQueryDtoAfter implements AsSameProperties<FileRessourcePutQueryDto> {}

export class FileRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePutBodyDtoAfter)
  public body: FileRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePutQueryDtoAfter)
  public query: FileRessourcePutQueryDtoAfter
}
