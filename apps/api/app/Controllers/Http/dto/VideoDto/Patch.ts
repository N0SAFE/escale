import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoRessourcePatchBodyDto {}

export class VideoRessourcePatchQueryDto {}

export class VideoRessourcePatchParamsDto {}

@Exclude()
export class VideoRessourcePatchFilesDto {}

@SkipTransform([['files', VideoRessourcePatchFilesDto]])
export class VideoRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchBodyDto)
  public body: VideoRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchQueryDto)
  public query: VideoRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchParamsDto)
  public params: VideoRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchFilesDto)
  public files: VideoRessourcePatchFilesDto

  public get after () {
    return new VideoRessourcePatchDtoAfter(this)
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

export class VideoRessourcePatchBodyDtoAfter
implements AsSameProperties<VideoRessourcePatchBodyDto> {}

export class VideoRessourcePatchQueryDtoAfter
implements AsSameProperties<VideoRessourcePatchQueryDto> {}

export class VideoRessourcePatchParamsDtoAfter
implements AsSameProperties<VideoRessourcePatchParamsDto> {}

@Exclude()
export class VideoRessourcePatchFilesDtoAfter
implements AsSameProperties<VideoRessourcePatchFilesDto> {}

@SkipTransform([['files', VideoRessourcePatchFilesDtoAfter]])
export class VideoRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchBodyDtoAfter)
  public body: VideoRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchQueryDtoAfter)
  public query: VideoRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchParamsDtoAfter)
  public params: VideoRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePatchFilesDtoAfter)
  public files: VideoRessourcePatchFilesDtoAfter
}
