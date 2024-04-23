import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoRessourceGetBodyDto {}

export class VideoRessourceGetQueryDto {}

export class VideoRessourceGetParamsDto {}

@Exclude()
export class VideoRessourceGetFilesDto {}

@SkipTransform([['files', VideoRessourceGetFilesDto]])
export class VideoRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetBodyDto)
  public body: VideoRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetQueryDto)
  public query: VideoRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetParamsDto)
  public params: VideoRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetFilesDto)
  public files: VideoRessourceGetFilesDto

  public get after () {
    return new VideoRessourceGetDtoAfter(this)
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

export class VideoRessourceGetBodyDtoAfter implements AsSameProperties<VideoRessourceGetBodyDto> {}

export class VideoRessourceGetQueryDtoAfter
implements AsSameProperties<VideoRessourceGetQueryDto> {}

export class VideoRessourceGetParamsDtoAfter
implements AsSameProperties<VideoRessourceGetParamsDto> {}

@Exclude()
export class VideoRessourceGetFilesDtoAfter
implements AsSameProperties<VideoRessourceGetFilesDto> {}

@SkipTransform([['files', VideoRessourceGetFilesDtoAfter]])
export class VideoRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoRessourceGetDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetBodyDtoAfter)
  public body: VideoRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetQueryDtoAfter)
  public query: VideoRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetParamsDtoAfter)
  public params: VideoRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetFilesDtoAfter)
  public files: VideoRessourceGetFilesDtoAfter
}
