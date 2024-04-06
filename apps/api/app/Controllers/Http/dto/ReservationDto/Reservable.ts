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
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'
import { EntityExist } from '../Decorator/EntityExist'
import { Custom } from '../Decorator/Custom'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  const dateTime1 = DateTime.fromISO(date1)
  const dateTime2 = DateTime.fromISO(date2)
  return dateTime1.toMillis() <= dateTime2.toMillis()
}

export class ReservationRessourceReservableBodyDto {}

export class ReservationRessourceReservableQueryDto {
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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'enabled', 'true'].includes(value))
  public includeExternalBlockedCalendarEvents: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'enabled', 'true'].includes(value))
  public includeExternalReservedCalendarEvents: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'enabled', 'true'].includes(value))
  public includeAvailabilities: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'enabled', 'true'].includes(value))
  public includeReservations: boolean
}

export class ReservationRessourceReservableParamsDto {}

@Exclude()
export class ReservationRessourceReservableFilesDto {}

@SkipTransform([['files', ReservationRessourceReservableFilesDto]])
export class ReservationRessourceReservableDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableBodyDto)
  public body: ReservationRessourceReservableBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableQueryDto)
  public query: ReservationRessourceReservableQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableParamsDto)
  public params: ReservationRessourceReservableParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableFilesDto)
  public files: ReservationRessourceReservableFilesDto

  public get after () {
    return new ReservationRessourceReservableDtoAfter(this)
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

export class ReservationRessourceReservableBodyDtoAfter
implements AsSameProperties<ReservationRessourceReservableBodyDto> {}

export class ReservationRessourceReservableQueryDtoAfter
implements AsSameProperties<ReservationRessourceReservableQueryDto> {
  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  @Transform(({ value }) => DateTime.fromISO(value))
  public from: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public to: DateTime

  public includeExternalBlockedCalendarEvents: boolean
  public includeExternalReservedCalendarEvents: boolean
  public includeAvailabilities: boolean
  public includeReservations: boolean
}

export class ReservationRessourceReservableParamsDtoAfter
implements AsSameProperties<ReservationRessourceReservableParamsDto> {}

@Exclude()
export class ReservationRessourceReservableFilesDtoAfter
implements AsSameProperties<ReservationRessourceReservableFilesDto> {}

@SkipTransform([['files', ReservationRessourceReservableFilesDtoAfter]])
export class ReservationRessourceReservableDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourceReservableDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableBodyDtoAfter)
  public body: ReservationRessourceReservableBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableQueryDtoAfter)
  public query: ReservationRessourceReservableQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableParamsDtoAfter)
  public params: ReservationRessourceReservableParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceReservableFilesDtoAfter)
  public files: ReservationRessourceReservableFilesDtoAfter
}
