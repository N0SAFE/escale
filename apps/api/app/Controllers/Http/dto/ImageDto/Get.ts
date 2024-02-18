import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class ImageRessourceGetBodyDto {}

export class ImageRessourceGetQueryDto {}

export class ImageRessourceGetFilesDto {}

export class ImageRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetBodyDto)
  public body: ImageRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetQueryDto)
  public query: ImageRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetFilesDto)
  public _images: ImageRessourceGetFilesDto

  public get after () {
    return new ImageRessourceGetDtoAfter(this)
  }

  public static fromRequest (request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), _images: request.allFiles() })
  }
}

export class ImageRessourceGetBodyDtoAfter implements AsSameProperties<ImageRessourceGetBodyDto> {}

export class ImageRessourceGetQueryDtoAfter
implements AsSameProperties<ImageRessourceGetQueryDto> {}

export class ImageRessourceGetFilesDtoAfter
implements AsSameProperties<ImageRessourceGetFilesDto> {}

export class ImageRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourceGetDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetBodyDtoAfter)
  public body: ImageRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetQueryDtoAfter)
  public query: ImageRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetFilesDtoAfter)
  public _images: ImageRessourceGetFilesDtoAfter
}
