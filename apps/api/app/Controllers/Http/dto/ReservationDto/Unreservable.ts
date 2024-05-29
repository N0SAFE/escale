import {
  IsBoolean,
  IsDefined,
  IsISO8601,
  IsObject,
  IsOptional,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { DateTime } from 'luxon'
import Spa from 'App/Models/Spa'
import { Custom } from '../Decorator/Custom'
import { EntityExist } from '../Decorator/EntityExist'

function checkDateIsAfter(date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  const dateTime1 = DateTime.fromISO(date1)
  const dateTime2 = DateTime.fromISO(date2)
  return dateTime1.toMillis() <= dateTime2.toMillis()
}

export class ReservationRessourceUnreservableBodyDto {}

export class ReservationRessourceUnreservableQueryDto {
  @Type(() => Number)
  @IsDefined()
  @EntityExist(Spa)
  public spa: number

  @IsDefined()
  @IsISO8601()
  @Custom('to', {
    function: checkDateIsAfter,
    message: 'from must be before to',
  })
  public from: string

  @IsDefined()
  @IsISO8601()
  public to: string

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public includeExternalBlockedCalendarEvents: boolean = true

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public includeExternalReservedCalendarEvents: boolean = true

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public includeUnavailabilities: boolean = true
}

export class ReservationRessourceUnreservableParamsDto {}

@Exclude()
export class ReservationRessourceUnreservableFilesDto {}

@SkipTransform([['files', ReservationRessourceUnreservableFilesDto]])
export class ReservationRessourceUnreservableDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableBodyDto)
  public body: ReservationRessourceUnreservableBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableQueryDto)
  public query: ReservationRessourceUnreservableQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableParamsDto)
  public params: ReservationRessourceUnreservableParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableFilesDto)
  public files: ReservationRessourceUnreservableFilesDto

  public get after() {
    return new ReservationRessourceUnreservableDtoAfter(this)
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

export class ReservationRessourceUnreservableBodyDtoAfter
  implements AsSameProperties<ReservationRessourceUnreservableBodyDto> {}

export class ReservationRessourceUnreservableQueryDtoAfter
  implements AsSameProperties<ReservationRessourceUnreservableQueryDto>
{
  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  @Transform(({ value }) => DateTime.fromISO(value))
  public from: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public to: DateTime

  public includeExternalBlockedCalendarEvents: boolean
  public includeExternalReservedCalendarEvents: boolean
  public includeUnavailabilities: boolean
}

export class ReservationRessourceUnreservableParamsDtoAfter
  implements AsSameProperties<ReservationRessourceUnreservableParamsDto> {}

@Exclude()
export class ReservationRessourceUnreservableFilesDtoAfter
  implements AsSameProperties<ReservationRessourceUnreservableFilesDto> {}

@SkipTransform([['files', ReservationRessourceUnreservableFilesDtoAfter]])
export class ReservationRessourceUnreservableDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourceUnreservableDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableBodyDtoAfter)
  public body: ReservationRessourceUnreservableBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableQueryDtoAfter)
  public query: ReservationRessourceUnreservableQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableParamsDtoAfter)
  public params: ReservationRessourceUnreservableParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceUnreservableFilesDtoAfter)
  public files: ReservationRessourceUnreservableFilesDtoAfter
}
