import {
  IsDefined,
  IsISO8601,
  IsNumber,
  IsObject,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import { EntityExist } from '../Decorator/EntityExist'

function checkDateIsAfter(date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() <= DateTime.fromISO(date2).toMillis()
}

export class ExternalCalendarEventsRessourceGetCollectionBodyDto {}

export class ExternalCalendarEventsRessourceGetCollectionQueryDto {
  @IsDefined()
  @IsISO8601()
  @Custom('endAt', {
    function: checkDateIsAfter,
    message: 'startAt must be before endAt',
  })
  public startAt: string

  @IsDefined()
  @IsISO8601()
  public endAt: string
}

export class ExternalCalendarEventsRessourceGetCollectionParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(ExternalCalendar)
  public externalCalendar: number
}

@Exclude()
export class ExternalCalendarEventsRessourceGetCollectionFilesDto {}

@SkipTransform([['files', ExternalCalendarEventsRessourceGetCollectionFilesDto]])
export class ExternalCalendarEventsRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionBodyDto)
  public body: ExternalCalendarEventsRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionQueryDto)
  public query: ExternalCalendarEventsRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionParamsDto)
  public params: ExternalCalendarEventsRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionFilesDto)
  public files: ExternalCalendarEventsRessourceGetCollectionFilesDto

  public get after() {
    return new ExternalCalendarEventsRessourceGetCollectionDtoAfter(this)
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

export class ExternalCalendarEventsRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<ExternalCalendarEventsRessourceGetCollectionBodyDto> {}

export class ExternalCalendarEventsRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<ExternalCalendarEventsRessourceGetCollectionQueryDto>
{
  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime
}

export class ExternalCalendarEventsRessourceGetCollectionParamsDtoAfter
  implements AsSameProperties<ExternalCalendarEventsRessourceGetCollectionParamsDto>
{
  public externalCalendar: number
}

@Exclude()
export class ExternalCalendarEventsRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<ExternalCalendarEventsRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', ExternalCalendarEventsRessourceGetCollectionFilesDtoAfter]])
export class ExternalCalendarEventsRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarEventsRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionBodyDtoAfter)
  public body: ExternalCalendarEventsRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionQueryDtoAfter)
  public query: ExternalCalendarEventsRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionParamsDtoAfter)
  public params: ExternalCalendarEventsRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceGetCollectionFilesDtoAfter)
  public files: ExternalCalendarEventsRessourceGetCollectionFilesDtoAfter
}
