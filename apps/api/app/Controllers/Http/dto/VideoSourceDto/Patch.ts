import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoSourceRessourcePatchBodyDto {}

export class VideoSourceRessourcePatchQueryDto {}

export class VideoSourceRessourcePatchParamsDto {}

@Exclude()
export class VideoSourceRessourcePatchFilesDto {}

@SkipTransform([['files', VideoSourceRessourcePatchFilesDto]])
export class VideoSourceRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchBodyDto)
  public body: VideoSourceRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchQueryDto)
  public query: VideoSourceRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchParamsDto)
  public params: VideoSourceRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchFilesDto)
  public files: VideoSourceRessourcePatchFilesDto

  public get after () {
    return new VideoSourceRessourcePatchDtoAfter(this)
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

export class VideoSourceRessourcePatchBodyDtoAfter
implements AsSameProperties<VideoSourceRessourcePatchBodyDto> {}

export class VideoSourceRessourcePatchQueryDtoAfter
implements AsSameProperties<VideoSourceRessourcePatchQueryDto> {}

export class VideoSourceRessourcePatchParamsDtoAfter
implements AsSameProperties<VideoSourceRessourcePatchParamsDto> {}

@Exclude()
export class VideoSourceRessourcePatchFilesDtoAfter
implements AsSameProperties<VideoSourceRessourcePatchFilesDto> {}

@SkipTransform([['files', VideoSourceRessourcePatchFilesDtoAfter]])
export class VideoSourceRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoSourceRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchBodyDtoAfter)
  public body: VideoSourceRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchQueryDtoAfter)
  public query: VideoSourceRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchParamsDtoAfter)
  public params: VideoSourceRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePatchFilesDtoAfter)
  public files: VideoSourceRessourcePatchFilesDtoAfter
}
