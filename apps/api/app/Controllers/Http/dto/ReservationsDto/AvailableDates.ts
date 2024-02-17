import {
  IsDefined,
  IsISO8601,
  IsObject,
  IsOptional,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import Spa from 'App/Models/Spa'
import { EntityExist } from '../Decorator/EntityExist'
import { AwaitPromise } from '../Decorator/AwaitPromise'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() <= DateTime.fromISO(date2).toMillis()
}

export class ReservationsRessourceAvailableDatesBodyDto {}

export class ReservationsRessourceAvailableDatesQueryDto {
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

  @IsDefined()
  public type: 'day' | 'night' | 'journey'

  @IsDefined()
  @Transform(({ value }) => Number(value))
  @EntityExist(Spa)
  public spa: number

  @IsOptional()
  public parseDateBeforeToday?: boolean
}

export class ReservationsRessourceAvailableDatesDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceAvailableDatesBodyDto)
  public body: ReservationsRessourceAvailableDatesBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceAvailableDatesQueryDto)
  public query: ReservationsRessourceAvailableDatesQueryDto

  public get after () {
    return new ReservationsRessourceAvailableDatesDtoAfter(this)
  }
}

export class ReservationsRessourceAvailableDatesBodyDtoAfter
implements AsSameProperties<ReservationsRessourceAvailableDatesBodyDto> {}

export class ReservationsRessourceAvailableDatesQueryDtoAfter
implements AsSameProperties<ReservationsRessourceAvailableDatesQueryDto> {
  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime

  public type: 'day' | 'night' | 'journey'

  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  public parseDateBeforeToday?: boolean
}

export class ReservationsRessourceAvailableDatesDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceAvailableDatesBodyDtoAfter)
  public body: ReservationsRessourceAvailableDatesBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceAvailableDatesQueryDtoAfter)
  public query: ReservationsRessourceAvailableDatesQueryDtoAfter
}
