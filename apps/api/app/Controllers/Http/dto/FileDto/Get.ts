import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FileRessourceGetBodyDto {}

export class FileRessourceGetQueryDto {}

export class FileRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetBodyDto)
  public body: FileRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetQueryDto)
  public query: FileRessourceGetQueryDto

  public get after() {
    return new FileRessourceGetDtoAfter(this)
  }
}

export class FileRessourceGetBodyDtoAfter implements AsSameProperties<FileRessourceGetBodyDto> {}

export class FileRessourceGetQueryDtoAfter implements AsSameProperties<FileRessourceGetQueryDto> {}

export class FileRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetBodyDtoAfter)
  public body: FileRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceGetQueryDtoAfter)
  public query: FileRessourceGetQueryDtoAfter
}
