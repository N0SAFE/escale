import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class ImageRessourceGetCollectionBodyDto {}

export class ImageRessourceGetCollectionQueryDto {}

export class ImageRessourceGetCollectionFilesDto {}

export class ImageRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetCollectionBodyDto)
  public body: ImageRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetCollectionQueryDto)
  public query: ImageRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetCollectionFilesDto)
  public _images: ImageRessourceGetCollectionFilesDto

  public get after() {
    return new ImageRessourceGetCollectionDtoAfter(this)
  }

  public static fromRequest(request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), _images: request.allFiles() })
  }
}

export class ImageRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<ImageRessourceGetCollectionBodyDto> {}

export class ImageRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<ImageRessourceGetCollectionQueryDto> {}

export class ImageRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<ImageRessourceGetCollectionFilesDto> {}

export class ImageRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetCollectionBodyDtoAfter)
  public body: ImageRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetCollectionQueryDtoAfter)
  public query: ImageRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetCollectionFilesDtoAfter)
  public _images: ImageRessourceGetCollectionFilesDtoAfter
}
