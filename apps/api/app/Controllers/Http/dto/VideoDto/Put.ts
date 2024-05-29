import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoRessourcePutBodyDto {}

export class VideoRessourcePutQueryDto {}

export class VideoRessourcePutParamsDto {}

@Exclude()
export class VideoRessourcePutFilesDto {}

@SkipTransform([['files', VideoRessourcePutFilesDto]])
export class VideoRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutBodyDto)
  public body: VideoRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutQueryDto)
  public query: VideoRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutParamsDto)
  public params: VideoRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutFilesDto)
  public files: VideoRessourcePutFilesDto

  public get after() {
    return new VideoRessourcePutDtoAfter(this)
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

export class VideoRessourcePutBodyDtoAfter implements AsSameProperties<VideoRessourcePutBodyDto> {}

export class VideoRessourcePutQueryDtoAfter
  implements AsSameProperties<VideoRessourcePutQueryDto> {}

export class VideoRessourcePutParamsDtoAfter
  implements AsSameProperties<VideoRessourcePutParamsDto> {}

@Exclude()
export class VideoRessourcePutFilesDtoAfter
  implements AsSameProperties<VideoRessourcePutFilesDto> {}

@SkipTransform([['files', VideoRessourcePutFilesDtoAfter]])
export class VideoRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoRessourcePutDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutBodyDtoAfter)
  public body: VideoRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutQueryDtoAfter)
  public query: VideoRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutParamsDtoAfter)
  public params: VideoRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePutFilesDtoAfter)
  public files: VideoRessourcePutFilesDtoAfter
}
