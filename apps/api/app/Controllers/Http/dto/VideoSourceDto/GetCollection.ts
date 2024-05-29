import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoSourceRessourceGetCollectionBodyDto {}

export class VideoSourceRessourceGetCollectionQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public page?: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public limit?: number
}

export class VideoSourceRessourceGetCollectionParamsDto {}

@Exclude()
export class VideoSourceRessourceGetCollectionFilesDto {}

@SkipTransform([['files', VideoSourceRessourceGetCollectionFilesDto]])
export class VideoSourceRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionBodyDto)
  public body: VideoSourceRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionQueryDto)
  public query: VideoSourceRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionParamsDto)
  public params: VideoSourceRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionFilesDto)
  public files: VideoSourceRessourceGetCollectionFilesDto

  public get after() {
    return new VideoSourceRessourceGetCollectionDtoAfter(this)
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

export class VideoSourceRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetCollectionBodyDto> {}

export class VideoSourceRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetCollectionQueryDto>
{
  public page?: number
  public limit?: number
}

export class VideoSourceRessourceGetCollectionParamsDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetCollectionParamsDto> {}

@Exclude()
export class VideoSourceRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<VideoSourceRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', VideoSourceRessourceGetCollectionFilesDtoAfter]])
export class VideoSourceRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoSourceRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionBodyDtoAfter)
  public body: VideoSourceRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionQueryDtoAfter)
  public query: VideoSourceRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionParamsDtoAfter)
  public params: VideoSourceRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoSourceRessourceGetCollectionFilesDtoAfter)
  public files: VideoSourceRessourceGetCollectionFilesDtoAfter
}
