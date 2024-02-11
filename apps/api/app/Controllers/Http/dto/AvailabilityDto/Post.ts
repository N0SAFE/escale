import {
  IsDefined,
  IsISO8601,
  IsNumber,
  IsObject,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'
import { AsSameProperties } from '../type/AsSameProperties'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { Custom } from '../Decorator/Custom'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() < DateTime.fromISO(date2).toMillis()
}

export class AvailabilityRessourcePostBodyDto {
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

  @IsDefined()
  @IsNumber()
  public nightPrice: number

  @IsDefined()
  @IsNumber()
  public dayPrice: number

  @IsDefined()
  @IsNumber()
  public journeyPrice: number
}

export class AvailabilityRessourcePostQueryDto {}

export class AvailabilityRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostBodyDto)
  public body: AvailabilityRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostQueryDto)
  public query: AvailabilityRessourcePostQueryDto

  public get after () {
    return new AvailabilityRessourcePostDtoAfter(this)
  }
}

export class AvailabilityRessourcePostBodyDtoAfter
implements AsSameProperties<AvailabilityRessourcePostBodyDto> {
  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime

  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  public nightPrice: number
  public dayPrice: number
  public journeyPrice: number
}

export class AvailabilityRessourcePostQueryDtoAfter
implements AsSameProperties<AvailabilityRessourcePostQueryDto> {}

export class AvailabilityRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostBodyDtoAfter)
  public body: AvailabilityRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostQueryDtoAfter)
  public query: AvailabilityRessourcePostQueryDtoAfter
}
