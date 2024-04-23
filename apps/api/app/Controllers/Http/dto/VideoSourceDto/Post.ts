import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoSourceRessourcePostBodyDto {}

export class VideoSourceRessourcePostQueryDto {}

export class VideoSourceRessourcePostParamsDto {}

@Exclude()
export class VideoSourceRessourcePostFilesDto {}

@SkipTransform([['files', VideoSourceRessourcePostFilesDto]])
export class VideoSourceRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostBodyDto)
  public body: VideoSourceRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostQueryDto)
  public query: VideoSourceRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostParamsDto)
  public params: VideoSourceRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostFilesDto)
  public files: VideoSourceRessourcePostFilesDto

  public get after () {
    return new VideoSourceRessourcePostDtoAfter(this)
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

export class VideoSourceRessourcePostBodyDtoAfter
implements AsSameProperties<VideoSourceRessourcePostBodyDto> {}

export class VideoSourceRessourcePostQueryDtoAfter
implements AsSameProperties<VideoSourceRessourcePostQueryDto> {}

export class VideoSourceRessourcePostParamsDtoAfter
implements AsSameProperties<VideoSourceRessourcePostParamsDto> {}

@Exclude()
export class VideoSourceRessourcePostFilesDtoAfter
implements AsSameProperties<VideoSourceRessourcePostFilesDto> {}

@SkipTransform([['files', VideoSourceRessourcePostFilesDtoAfter]])
export class VideoSourceRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoSourceRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostBodyDtoAfter)
  public body: VideoSourceRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostQueryDtoAfter)
  public query: VideoSourceRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostParamsDtoAfter)
  public params: VideoSourceRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePostFilesDtoAfter)
  public files: VideoSourceRessourcePostFilesDtoAfter
}
