import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import Image from 'App/Models/Image'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { EntityExist } from '../Decorator/EntityExist'

export class ImageRessourceGetBodyDto {}

export class ImageRessourceGetQueryDto {}

export class ImageRessourceGetParamsDto {
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  @EntityExist(Image)
  public id: number
}

@Exclude()
export class ImageRessourceGetFilesDto {}

@SkipTransform([['files', ImageRessourceGetFilesDto]])
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
  @Type(() => ImageRessourceGetParamsDto)
  public params: ImageRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetFilesDto)
  public files: ImageRessourceGetFilesDto

  public get after() {
    return new ImageRessourceGetDtoAfter(this)
  }

  public static fromRequest(request: RequestContract) {
    return new this({
      body: request.body(),
      query: request.qs(),
      params: request.params(),
      files: request.allFiles(),
    })
  }
}

export class ImageRessourceGetBodyDtoAfter implements AsSameProperties<ImageRessourceGetBodyDto> {}

export class ImageRessourceGetQueryDtoAfter
  implements AsSameProperties<ImageRessourceGetQueryDto> {}

export class ImageRessourceGetParamsDtoAfter
  implements AsSameProperties<ImageRessourceGetParamsDto>
{
  @Transform(({ value }) => Image.findOrFail(value))
  @AwaitPromise
  public id: Image
}

@Exclude()
export class ImageRessourceGetFilesDtoAfter
  implements AsSameProperties<ImageRessourceGetFilesDto> {}

@SkipTransform([['files', ImageRessourceGetFilesDtoAfter]])
export class ImageRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourceGetDto, 'after'>>
{
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
  @Type(() => ImageRessourceGetParamsDtoAfter)
  public params: ImageRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceGetFilesDtoAfter)
  public files: ImageRessourceGetFilesDtoAfter
}
