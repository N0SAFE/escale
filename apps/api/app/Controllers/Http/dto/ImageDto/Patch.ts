import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class ImageRessourcePatchBodyDto {}

export class ImageRessourcePatchQueryDto {}

export class ImageRessourcePatchFilesDto {}

export class ImageRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchBodyDto)
  public body: ImageRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchQueryDto)
  public query: ImageRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchFilesDto)
  public _images: ImageRessourcePatchFilesDto

  public get after () {
    return new ImageRessourcePatchDtoAfter(this)
  }

  public static fromRequest (request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), _images: request.allFiles() })
  }
}

export class ImageRessourcePatchBodyDtoAfter
implements AsSameProperties<ImageRessourcePatchBodyDto> {}

export class ImageRessourcePatchQueryDtoAfter
implements AsSameProperties<ImageRessourcePatchQueryDto> {}

export class ImageRessourcePatchFilesDtoAfter
implements AsSameProperties<ImageRessourcePatchFilesDto> {}

export class ImageRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchBodyDtoAfter)
  public body: ImageRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchQueryDtoAfter)
  public query: ImageRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchFilesDtoAfter)
  public _images: ImageRessourcePatchFilesDtoAfter
}
