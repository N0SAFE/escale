import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoSourceRessourceGetBodyDto {}

export class VideoSourceRessourceGetQueryDto {}

export class VideoSourceRessourceGetParamsDto {}

@Exclude()
export class VideoSourceRessourceGetFilesDto {}

@SkipTransform([['files', VideoSourceRessourceGetFilesDto]])
export class VideoSourceRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetBodyDto)
  public body: VideoSourceRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetQueryDto)
  public query: VideoSourceRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetParamsDto)
  public params: VideoSourceRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetFilesDto)
  public files: VideoSourceRessourceGetFilesDto

  public get after() {
    return new VideoSourceRessourceGetDtoAfter(this)
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

export class VideoSourceRessourceGetBodyDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetBodyDto> {}

export class VideoSourceRessourceGetQueryDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetQueryDto> {}

export class VideoSourceRessourceGetParamsDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetParamsDto> {}

@Exclude()
export class VideoSourceRessourceGetFilesDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetFilesDto> {}

@SkipTransform([['files', VideoSourceRessourceGetFilesDtoAfter]])
export class VideoSourceRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoSourceRessourceGetDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetBodyDtoAfter)
  public body: VideoSourceRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetQueryDtoAfter)
  public query: VideoSourceRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetParamsDtoAfter)
  public params: VideoSourceRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetFilesDtoAfter)
  public files: VideoSourceRessourceGetFilesDtoAfter
}
