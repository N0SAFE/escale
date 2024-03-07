import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Image from 'App/Models/Image'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class ImageRessourceDeleteBodyDto {}

export class ImageRessourceDeleteQueryDto {}

export class ImageRessourceDeleteParamsDto {
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  @EntityExist(Image)
  public id: number
}

@Exclude()
export class ImageRessourceDeleteFilesDto {}

@SkipTransform([['files', ImageRessourceDeleteFilesDto]])
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
  @Type(() => ImageRessourceDeleteParamsDto)
  public params: ImageRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteFilesDto)
  public files: ImageRessourceDeleteFilesDto

  public get after () {
    return new ImageRessourceDeleteDtoAfter(this)
  }

  public static fromRequest (request: RequestContract) {
    return new this({
      body: request.body(),
      query: request.qs(),
      params: request.params(),
      files: request.allFiles(),
    })
  }
}

export class ImageRessourceDeleteBodyDtoAfter
implements AsSameProperties<ImageRessourceDeleteBodyDto> {}

export class ImageRessourceDeleteQueryDtoAfter
implements AsSameProperties<ImageRessourceDeleteQueryDto> {}

export class ImageRessourceDeleteParamsDtoAfter
implements AsSameProperties<ImageRessourceDeleteParamsDto> {
  @Transform(({ value }) => Image.findOrFail(value))
  @AwaitPromise
  public id: Image
}

@Exclude()
export class ImageRessourceDeleteFilesDtoAfter
implements AsSameProperties<ImageRessourceDeleteFilesDto> {}

@SkipTransform([['files', ImageRessourceDeleteFilesDtoAfter]])
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
  @Type(() => ImageRessourceDeleteParamsDtoAfter)
  public params: ImageRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceDeleteFilesDtoAfter)
  public files: ImageRessourceDeleteFilesDtoAfter
}
