import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class ImageRessourcePutBodyDto {}

export class ImageRessourcePutQueryDto {}

export class ImageRessourcePutFilesDto {}

export class ImageRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePutBodyDto)
  public body: ImageRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePutQueryDto)
  public query: ImageRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePutFilesDto)
  public _images: ImageRessourcePutFilesDto

  public get after () {
    return new ImageRessourcePutDtoAfter(this)
  }

  public static fromRequest (request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), _images: request.allFiles() })
  }
}

export class ImageRessourcePutBodyDtoAfter implements AsSameProperties<ImageRessourcePutBodyDto> {}

export class ImageRessourcePutQueryDtoAfter
implements AsSameProperties<ImageRessourcePutQueryDto> {}

export class ImageRessourcePutFilesDtoAfter
implements AsSameProperties<ImageRessourcePutFilesDto> {}

export class ImageRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourcePutDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePutBodyDtoAfter)
  public body: ImageRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePutQueryDtoAfter)
  public query: ImageRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePutFilesDtoAfter)
  public _images: ImageRessourcePutFilesDtoAfter
}
