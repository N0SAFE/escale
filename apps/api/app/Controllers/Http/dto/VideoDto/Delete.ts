import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoRessourceDeleteBodyDto {}

export class VideoRessourceDeleteQueryDto {}

export class VideoRessourceDeleteParamsDto {}

@Exclude()
export class VideoRessourceDeleteFilesDto {}

@SkipTransform([['files', VideoRessourceDeleteFilesDto]])
export class VideoRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteBodyDto)
  public body: VideoRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteQueryDto)
  public query: VideoRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteParamsDto)
  public params: VideoRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteFilesDto)
  public files: VideoRessourceDeleteFilesDto

  public get after() {
    return new VideoRessourceDeleteDtoAfter(this)
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

export class VideoRessourceDeleteBodyDtoAfter
  implements AsSameProperties<VideoRessourceDeleteBodyDto> {}

export class VideoRessourceDeleteQueryDtoAfter
  implements AsSameProperties<VideoRessourceDeleteQueryDto> {}

export class VideoRessourceDeleteParamsDtoAfter
  implements AsSameProperties<VideoRessourceDeleteParamsDto> {}

@Exclude()
export class VideoRessourceDeleteFilesDtoAfter
  implements AsSameProperties<VideoRessourceDeleteFilesDto> {}

@SkipTransform([['files', VideoRessourceDeleteFilesDtoAfter]])
export class VideoRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoRessourceDeleteDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteBodyDtoAfter)
  public body: VideoRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteQueryDtoAfter)
  public query: VideoRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteParamsDtoAfter)
  public params: VideoRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceDeleteFilesDtoAfter)
  public files: VideoRessourceDeleteFilesDtoAfter
}
