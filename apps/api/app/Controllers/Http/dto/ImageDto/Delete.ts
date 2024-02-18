import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class ImageRessourceDeleteBodyDto {}

export class ImageRessourceDeleteQueryDto {}

export class ImageRessourceDeleteFilesDto {}

export class ImageRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteBodyDto)
  public body: ImageRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteQueryDto)
  public query: ImageRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteFilesDto)
  public _images: ImageRessourceDeleteFilesDto

  public get after () {
    return new ImageRessourceDeleteDtoAfter(this)
  }

  public static fromRequest (request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), _images: request.allFiles() })
  }
}

export class ImageRessourceDeleteBodyDtoAfter
implements AsSameProperties<ImageRessourceDeleteBodyDto> {}

export class ImageRessourceDeleteQueryDtoAfter
implements AsSameProperties<ImageRessourceDeleteQueryDto> {}

export class ImageRessourceDeleteFilesDtoAfter
implements AsSameProperties<ImageRessourceDeleteFilesDto> {}

export class ImageRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteBodyDtoAfter)
  public body: ImageRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteQueryDtoAfter)
  public query: ImageRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteFilesDtoAfter)
  public _images: ImageRessourceDeleteFilesDtoAfter
}
