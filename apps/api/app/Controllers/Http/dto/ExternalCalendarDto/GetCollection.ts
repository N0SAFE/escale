import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class ExternalCalendarRessourceGetCollectionBodyDto {}

export class ExternalCalendarRessourceGetCollectionQueryDto {}

export class ExternalCalendarRessourceGetCollectionParamsDto {}

@Exclude()
export class ExternalCalendarRessourceGetCollectionFilesDto {}

@SkipTransform([['files', ExternalCalendarRessourceGetCollectionFilesDto]])
export class ExternalCalendarRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionBodyDto)
  public body: ExternalCalendarRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionQueryDto)
  public query: ExternalCalendarRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionParamsDto)
  public params: ExternalCalendarRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionFilesDto)
  public files: ExternalCalendarRessourceGetCollectionFilesDto

  public get after() {
    return new ExternalCalendarRessourceGetCollectionDtoAfter(this)
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

export class ExternalCalendarRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetCollectionBodyDto> {}

export class ExternalCalendarRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetCollectionQueryDto> {}

export class ExternalCalendarRessourceGetCollectionParamsDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetCollectionParamsDto> {}

@Exclude()
export class ExternalCalendarRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', ExternalCalendarRessourceGetCollectionFilesDtoAfter]])
export class ExternalCalendarRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionBodyDtoAfter)
  public body: ExternalCalendarRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionQueryDtoAfter)
  public query: ExternalCalendarRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionParamsDtoAfter)
  public params: ExternalCalendarRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetCollectionFilesDtoAfter)
  public files: ExternalCalendarRessourceGetCollectionFilesDtoAfter
}
