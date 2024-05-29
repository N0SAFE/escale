import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FileRessourcePostBodyDto {}

export class FileRessourcePostQueryDto {}

export class FileRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePostBodyDto)
  public body: FileRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePostQueryDto)
  public query: FileRessourcePostQueryDto

  public get after() {
    return new FileRessourcePostDtoAfter(this)
  }
}

export class FileRessourcePostBodyDtoAfter implements AsSameProperties<FileRessourcePostBodyDto> {}

export class FileRessourcePostQueryDtoAfter
  implements AsSameProperties<FileRessourcePostQueryDto> {}

export class FileRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePostBodyDtoAfter)
  public body: FileRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FileRessourcePostQueryDtoAfter)
  public query: FileRessourcePostQueryDtoAfter
}
