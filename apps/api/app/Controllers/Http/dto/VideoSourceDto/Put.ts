import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoSourceRessourcePutBodyDto {}

export class VideoSourceRessourcePutQueryDto {}

export class VideoSourceRessourcePutParamsDto {}

@Exclude()
export class VideoSourceRessourcePutFilesDto {}

@SkipTransform([['files', VideoSourceRessourcePutFilesDto]])
export class VideoSourceRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutBodyDto)
  public body: VideoSourceRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutQueryDto)
  public query: VideoSourceRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutParamsDto)
  public params: VideoSourceRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutFilesDto)
  public files: VideoSourceRessourcePutFilesDto

  public get after() {
    return new VideoSourceRessourcePutDtoAfter(this)
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

export class VideoSourceRessourcePutBodyDtoAfter
  implements AsSameProperties<VideoSourceRessourcePutBodyDto> {}

export class VideoSourceRessourcePutQueryDtoAfter
  implements AsSameProperties<VideoSourceRessourcePutQueryDto> {}

export class VideoSourceRessourcePutParamsDtoAfter
  implements AsSameProperties<VideoSourceRessourcePutParamsDto> {}

@Exclude()
export class VideoSourceRessourcePutFilesDtoAfter
  implements AsSameProperties<VideoSourceRessourcePutFilesDto> {}

@SkipTransform([['files', VideoSourceRessourcePutFilesDtoAfter]])
export class VideoSourceRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoSourceRessourcePutDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutBodyDtoAfter)
  public body: VideoSourceRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutQueryDtoAfter)
  public query: VideoSourceRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutParamsDtoAfter)
  public params: VideoSourceRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourcePutFilesDtoAfter)
  public files: VideoSourceRessourcePutFilesDtoAfter
}
