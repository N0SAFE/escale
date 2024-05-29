import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class VideoRessourceGetCollectionBodyDto {}

export class VideoRessourceGetCollectionQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public page?: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public limit?: number
}

export class VideoRessourceGetCollectionParamsDto {}

@Exclude()
export class VideoRessourceGetCollectionFilesDto {}

@SkipTransform([['files', VideoRessourceGetCollectionFilesDto]])
export class VideoRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionBodyDto)
  public body: VideoRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionQueryDto)
  public query: VideoRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionParamsDto)
  public params: VideoRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionFilesDto)
  public files: VideoRessourceGetCollectionFilesDto

  public get after() {
    return new VideoRessourceGetCollectionDtoAfter(this)
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

export class VideoRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<VideoRessourceGetCollectionBodyDto> {}

export class VideoRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<VideoRessourceGetCollectionQueryDto>
{
  public page?: number
  public limit?: number
}

export class VideoRessourceGetCollectionParamsDtoAfter
  implements AsSameProperties<VideoRessourceGetCollectionParamsDto> {}

@Exclude()
export class VideoRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<VideoRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', VideoRessourceGetCollectionFilesDtoAfter]])
export class VideoRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<VideoRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionBodyDtoAfter)
  public body: VideoRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionQueryDtoAfter)
  public query: VideoRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionParamsDtoAfter)
  public params: VideoRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => VideoRessourceGetCollectionFilesDtoAfter)
  public files: VideoRessourceGetCollectionFilesDtoAfter
}
