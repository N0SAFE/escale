import { IsDefined, IsISO8601, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { DateTime } from 'luxon'
import Spa from 'App/Models/Spa'
import { EntityExist } from '../Decorator/EntityExist'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class ReservationsRessourcePriceBodyDto {}

export class ReservationsRessourcePriceQueryDto {
  @IsDefined()
  @IsISO8601()
  public date: string

  @IsDefined()
  public type: 'night' | 'afternoon' | 'journey'

  @IsDefined()
  @EntityExist(Spa)
  public spa: number
}

export class ReservationsRessourcePriceDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourcePriceBodyDto)
  public body: ReservationsRessourcePriceBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourcePriceQueryDto)
  public query: ReservationsRessourcePriceQueryDto

  public get after () {
    return new ReservationsRessourcePriceDtoAfter(this)
  }
}

export class ReservationsRessourcePriceBodyDtoAfter
implements AsSameProperties<ReservationsRessourcePriceBodyDto> {}

export class ReservationsRessourcePriceQueryDtoAfter
implements AsSameProperties<ReservationsRessourcePriceQueryDto> {
  @Transform(({ value }) => DateTime.fromISO(value))
  public date: DateTime

  public type: 'night' | 'afternoon'

  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa
}

export class ReservationsRessourcePriceDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourcePriceBodyDtoAfter)
  public body: ReservationsRessourcePriceBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourcePriceQueryDtoAfter)
  public query: ReservationsRessourcePriceQueryDtoAfter
}
