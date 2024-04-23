import { IsDefined, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { ValidateFile } from '../Decorator/ValidateFile'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export class VideoRessourcePostBodyDto {
  @IsDefined()
  public alt: string

  @IsOptional()
  public name?: string
}

export class VideoRessourcePostQueryDto {}

export class VideoRessourcePostParamsDto {}

@Exclude()
export class VideoRessourcePostFilesDto {
  @IsDefined()
  @IsObject({ each: true })
  @ValidateFile(
    {
      extnames: ['mp4', 'webm', 'ogg', 'avi'],
      maxSize: '50mb',
    },
    { each: true }
  )
  public sources: MultipartFileContract[]
}

@SkipTransform([['files', VideoRessourcePostFilesDto]])
export class VideoRessourcePostDto extends BaseDto {
  @IsDefined()
  @ValidateNested()
  @IsObject()
  @Type(() => VideoRessourcePostBodyDto)
  public body: VideoRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePostQueryDto)
  public query: VideoRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePostParamsDto)
  public params: VideoRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePostFilesDto)
  public files: VideoRessourcePostFilesDto

  public get after () {
    return new VideoRessourcePostDtoAfter(this)
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

export class VideoRessourcePostBodyDtoAfter implements AsSameProperties<VideoRessourcePostBodyDto> {
  public alt: string
  public name?: string
}

export class VideoRessourcePostQueryDtoAfter
implements AsSameProperties<VideoRessourcePostQueryDto> {}

export class VideoRessourcePostParamsDtoAfter
implements AsSameProperties<VideoRessourcePostParamsDto> {}

@Exclude()
export class VideoRessourcePostFilesDtoAfter
implements AsSameProperties<VideoRessourcePostFilesDto> {
  public sources: MultipartFileContract[]
}

@SkipTransform([['files', VideoRessourcePostFilesDtoAfter]])
export class VideoRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePostBodyDtoAfter)
  public body: VideoRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePostQueryDtoAfter)
  public query: VideoRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePostParamsDtoAfter)
  public params: VideoRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourcePostFilesDtoAfter)
  public files: VideoRessourcePostFilesDtoAfter
}
