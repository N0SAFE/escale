import {
  IsDefined,
  IsISO8601,
  IsObject,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { AwaitPromise } from '../Decorator/AwaitPromise'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() <= DateTime.fromISO(date2).toMillis()
}

export class ReservationsRessourceJourneyPriceBodyDto {}

export class ReservationsRessourceJourneyPriceQueryDto {
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
  @EntityExist(Spa)
  public spa: number
}

export class ReservationsRessourceJourneyPriceDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceJourneyPriceBodyDto)
  public body: ReservationsRessourceJourneyPriceBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceJourneyPriceQueryDto)
  public query: ReservationsRessourceJourneyPriceQueryDto

  public get after () {
    return new ReservationsRessourceJourneyPriceDtoAfter(this)
  }
}

export class ReservationsRessourceJourneyPriceBodyDtoAfter
implements AsSameProperties<ReservationsRessourceJourneyPriceBodyDto> {}

export class ReservationsRessourceJourneyPriceQueryDtoAfter
implements AsSameProperties<ReservationsRessourceJourneyPriceQueryDto> {
  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime

  public type: 'day' | 'night' | 'journey'

  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa
}

export class ReservationsRessourceJourneyPriceDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceJourneyPriceBodyDtoAfter)
  public body: ReservationsRessourceJourneyPriceBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceJourneyPriceQueryDtoAfter)
  public query: ReservationsRessourceJourneyPriceQueryDtoAfter
}
