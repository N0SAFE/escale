import {
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Image from 'App/Models/Image'
import Video from 'App/Models/Video'
import Comment from 'App/Models/Comment'

export class HomeRessourcePatchBodyDto {
  @IsOptional()
  @IsString()
  public description?: string

  @IsOptional()
  @IsNumber()
  @EntityExist(Image)
  public imageId?: number

  @IsOptional()
  @IsNumber()
  @EntityExist(Image)
  public commentBackgroundImageId?: number

  @IsOptional()
  @IsNumber()
  @EntityExist(Video)
  public videoId?: number

  @IsOptional()
  @IsNumber({}, { each: true })
  @EntityExist(Comment, { each: true })
  public commentIds?: number[]
}

export class HomeRessourcePatchQueryDto {}

export class HomeRessourcePatchParamsDto {}

@Exclude()
export class HomeRessourcePatchFilesDto {}

@SkipTransform([['files', HomeRessourcePatchFilesDto]])
export class HomeRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchBodyDto)
  public body: HomeRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchQueryDto)
  public query: HomeRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchParamsDto)
  public params: HomeRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchFilesDto)
  public files: HomeRessourcePatchFilesDto

  public get after () {
    return new HomeRessourcePatchDtoAfter(this)
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

export class HomeRessourcePatchBodyDtoAfter implements AsSameProperties<HomeRessourcePatchBodyDto> {
  public description?: string
  public imageId?: number
  public commentBackgroundImageId?: number
  public videoId?: number
  public commentIds?: number[]
}

export class HomeRessourcePatchQueryDtoAfter
implements AsSameProperties<HomeRessourcePatchQueryDto> {}

export class HomeRessourcePatchParamsDtoAfter
implements AsSameProperties<HomeRessourcePatchParamsDto> {}

@Exclude()
export class HomeRessourcePatchFilesDtoAfter
implements AsSameProperties<HomeRessourcePatchFilesDto> {}

@SkipTransform([['files', HomeRessourcePatchFilesDtoAfter]])
export class HomeRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<HomeRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchBodyDtoAfter)
  public body: HomeRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchQueryDtoAfter)
  public query: HomeRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchParamsDtoAfter)
  public params: HomeRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePatchFilesDtoAfter)
  public files: HomeRessourcePatchFilesDtoAfter
}
