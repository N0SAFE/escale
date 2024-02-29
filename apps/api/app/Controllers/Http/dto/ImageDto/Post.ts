import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { ValidateFile } from '../Decorator/ValidateFile'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class ImageRessourcePostBodyDto {
  @IsDefined()
  public alt: string
}

export class ImageRessourcePostQueryDto {}

@Exclude()
export class ImageRessourcePostFileDto {
  @IsDefined()
  @IsObject()
  @ValidateFile({
    extnames: ['jpg', 'jpeg', 'png'],
    maxSize: '2mb',
  })
  public image: MultipartFileContract
}

@SkipTransform([['files', ImageRessourcePostFileDto]])
export class ImageRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePostBodyDto)
  public body: ImageRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePostQueryDto)
  public query: ImageRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePostFileDto)
  public files: ImageRessourcePostFileDto

  public get after () {
    return new ImageRessourcePostDtoAfter(this, true)
  }

  public static fromRequest (request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), files: request.allFiles() })
  }
}

export class ImageRessourcePostBodyDtoAfter implements AsSameProperties<ImageRessourcePostBodyDto> {
  public alt: string
}

export class ImageRessourcePostQueryDtoAfter
implements AsSameProperties<ImageRessourcePostQueryDto> {}

export class ImageRessourcePostFileDtoAfter implements AsSameProperties<ImageRessourcePostFileDto> {
  public image: MultipartFileContract
}

@SkipTransform(['files'])
export class ImageRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePostBodyDtoAfter)
  public body: ImageRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePostQueryDtoAfter)
  public query: ImageRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePostFileDtoAfter)
  public files: ImageRessourcePostFileDtoAfter
}
