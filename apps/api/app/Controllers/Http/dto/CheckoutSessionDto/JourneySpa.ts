import {
  IsDefined,
  IsISO8601,
  IsObject,
  IsUrl,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import Spa from 'App/Models/Spa'
import { EntityExist } from '../Decorator/EntityExist'
import { IsAfterNow } from '../Decorator/IsAfterNow'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() < DateTime.fromISO(date2).toMillis()
}

export class CheckoutSessionRessourceJourneySpaBodyDto {
  @IsDefined()
  @EntityExist(Spa)
  public spa: number

  @IsDefined()
  @IsUrl({
    require_tld: false,
  })
  public successUrl: string

  @IsDefined()
  @IsUrl({
    require_tld: false,
  })
  public cancelUrl: string

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

export class CheckoutSessionRessourceJourneySpaQueryDto {}

export class CheckoutSessionRessourceJourneySpaDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceJourneySpaBodyDto)
  public body: CheckoutSessionRessourceJourneySpaBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceJourneySpaQueryDto)
  public query: CheckoutSessionRessourceJourneySpaQueryDto

  public get after () {
    return new CheckoutSessionRessourceJourneySpaDtoAfter(this)
  }
}

export class CheckoutSessionRessourceJourneySpaBodyDtoAfter
implements AsSameProperties<CheckoutSessionRessourceJourneySpaBodyDto> {
  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  public successUrl: string
  public cancelUrl: string

  @Transform(({ value }) => DateTime.fromISO(value))
  @IsAfterNow()
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  @IsAfterNow()
  public endAt: DateTime
}

export class CheckoutSessionRessourceJourneySpaQueryDtoAfter
implements AsSameProperties<CheckoutSessionRessourceJourneySpaQueryDto> {}

export class CheckoutSessionRessourceJourneySpaDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceJourneySpaBodyDtoAfter)
  public body: CheckoutSessionRessourceJourneySpaBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceJourneySpaQueryDtoAfter)
  public query: CheckoutSessionRessourceJourneySpaQueryDtoAfter
}
