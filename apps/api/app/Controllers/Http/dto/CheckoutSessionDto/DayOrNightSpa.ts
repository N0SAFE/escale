import { IsDefined, IsEnum, IsISO8601, IsObject, IsUrl, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { IsAfterNow } from '../Decorator/IsAfterNow'

export class CheckoutSessionRessourceDayOrNightSpaBodyDto {
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
  public date: string
}

export class CheckoutSessionRessourceDayOrNightSpaQueryDto {
  // @IsDefined()
  // @IsEnum(['day', 'night'])
  // public type: 'day' | 'night' @flag enable night and journey

  @IsDefined()
  @IsEnum(['night'])
  public type: 'night'
}

export class CheckoutSessionRessourceDayOrNightSpaDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceDayOrNightSpaBodyDto)
  public body: CheckoutSessionRessourceDayOrNightSpaBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceDayOrNightSpaQueryDto)
  public query: CheckoutSessionRessourceDayOrNightSpaQueryDto

  public get after () {
    return new CheckoutSessionRessourceDayOrNightSpaDtoAfter(this)
  }
}

export class CheckoutSessionRessourceDayOrNightSpaBodyDtoAfter
implements AsSameProperties<CheckoutSessionRessourceDayOrNightSpaBodyDto> {
  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  public successUrl: string
  public cancelUrl: string

  @Transform(({ value }) => DateTime.fromISO(value))
  @IsAfterNow()
  public date: DateTime
}

export class CheckoutSessionRessourceDayOrNightSpaQueryDtoAfter
implements AsSameProperties<CheckoutSessionRessourceDayOrNightSpaQueryDto> {
  // public type: 'day' | 'night' @flag enable night and journey
  public type: 'night'
}

export class CheckoutSessionRessourceDayOrNightSpaDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceDayOrNightSpaBodyDtoAfter)
  public body: CheckoutSessionRessourceDayOrNightSpaBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceDayOrNightSpaQueryDtoAfter)
  public query: CheckoutSessionRessourceDayOrNightSpaQueryDtoAfter
}
