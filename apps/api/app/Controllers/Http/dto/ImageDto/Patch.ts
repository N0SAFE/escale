import {
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Image from 'App/Models/Image'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class ImageRessourcePatchBodyDto {
  @IsOptional()
  @IsString()
  public name: string

  @IsOptional()
  @IsString()
  public alt: string
}

export class ImageRessourcePatchQueryDto {}

export class ImageRessourcePatchParamsDto {
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  @EntityExist(Image)
  public id: number
}

@Exclude()
export class ImageRessourcePatchFilesDto {}

@SkipTransform([['files', ImageRessourcePatchFilesDto]])
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
  @Type(() => ImageRessourcePatchParamsDto)
  public params: ImageRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchFilesDto)
  public files: ImageRessourcePatchFilesDto

  public get after() {
    return new ImageRessourcePatchDtoAfter(this)
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

export class ImageRessourcePatchBodyDtoAfter
  implements AsSameProperties<ImageRessourcePatchBodyDto>
{
  public name: string
  public alt: string
}

export class ImageRessourcePatchQueryDtoAfter
  implements AsSameProperties<ImageRessourcePatchQueryDto> {}

export class ImageRessourcePatchParamsDtoAfter
  implements AsSameProperties<ImageRessourcePatchParamsDto>
{
  @Transform(({ value }) => Image.findOrFail(value))
  @AwaitPromise
  public id: Image
}

@Exclude()
export class ImageRessourcePatchFilesDtoAfter
  implements AsSameProperties<ImageRessourcePatchFilesDto> {}

@SkipTransform([['files', ImageRessourcePatchFilesDtoAfter]])
export class ImageRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourcePatchDto, 'after'>>
{
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
  @Type(() => ImageRessourcePatchParamsDtoAfter)
  public params: ImageRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourcePatchFilesDtoAfter)
  public files: ImageRessourcePatchFilesDtoAfter
}
