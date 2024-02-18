import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FileRessourceDeleteBodyDto {}

export class FileRessourceDeleteQueryDto {}

export class FileRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceDeleteBodyDto)
  public body: FileRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceDeleteQueryDto)
  public query: FileRessourceDeleteQueryDto

  public get after () {
    return new FileRessourceDeleteDtoAfter(this)
  }
}

export class FileRessourceDeleteBodyDtoAfter
implements AsSameProperties<FileRessourceDeleteBodyDto> {}

export class FileRessourceDeleteQueryDtoAfter
implements AsSameProperties<FileRessourceDeleteQueryDto> {}

export class FileRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceDeleteBodyDtoAfter)
  public body: FileRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourceDeleteQueryDtoAfter)
  public query: FileRessourceDeleteQueryDtoAfter
}
