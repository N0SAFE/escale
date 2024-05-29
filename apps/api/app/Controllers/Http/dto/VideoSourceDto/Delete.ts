import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoSourceRessourceDeleteBodyDto {}

export class VideoSourceRessourceDeleteQueryDto {}

export class VideoSourceRessourceDeleteParamsDto {}

@Exclude()
export class VideoSourceRessourceDeleteFilesDto {}

@SkipTransform([['files', VideoSourceRessourceDeleteFilesDto]])
export class VideoSourceRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteBodyDto)
  public body: VideoSourceRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteQueryDto)
  public query: VideoSourceRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteParamsDto)
  public params: VideoSourceRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteFilesDto)
  public files: VideoSourceRessourceDeleteFilesDto

  public get after() {
    return new VideoSourceRessourceDeleteDtoAfter(this)
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

export class VideoSourceRessourceDeleteBodyDtoAfter
  implements AsSameProperties<VideoSourceRessourceDeleteBodyDto> {}

export class VideoSourceRessourceDeleteQueryDtoAfter
  implements AsSameProperties<VideoSourceRessourceDeleteQueryDto> {}

export class VideoSourceRessourceDeleteParamsDtoAfter
  implements AsSameProperties<VideoSourceRessourceDeleteParamsDto> {}

@Exclude()
export class VideoSourceRessourceDeleteFilesDtoAfter
  implements AsSameProperties<VideoSourceRessourceDeleteFilesDto> {}

@SkipTransform([['files', VideoSourceRessourceDeleteFilesDtoAfter]])
export class VideoSourceRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoSourceRessourceDeleteDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteBodyDtoAfter)
  public body: VideoSourceRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteQueryDtoAfter)
  public query: VideoSourceRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteParamsDtoAfter)
  public params: VideoSourceRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceDeleteFilesDtoAfter)
  public files: VideoSourceRessourceDeleteFilesDtoAfter
}
