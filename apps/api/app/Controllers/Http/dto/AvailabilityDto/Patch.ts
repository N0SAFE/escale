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
import { AwaitPromise } from '../Decorator/AwaitPromise'
import Availability from 'App/Models/Availability'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() <= DateTime.fromISO(date2).toMillis()
}

export class Price {
  @IsDefined()
  @IsNumber()
  public night: number

  @IsDefined()
  @IsNumber()
  public day: number

  @IsDefined()
  @IsNumber()
  public journey: number
}

export class AvailabilityRessourcePatchBodyDto {
  @IsDefined()
  @EntityExist(Spa)
  public spa: number

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
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  public monPrice: Price = {
      night: 0,
      day: 0,
      journey: 0,
    }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  public tuePrice: Price = {
      night: 0,
      day: 0,
      journey: 0,
    }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  public wedPrice: Price = {
      night: 0,
      day: 0,
      journey: 0,
    }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  public thuPrice: Price = {
      night: 0,
      day: 0,
      journey: 0,
    }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  public friPrice: Price = {
      night: 0,
      day: 0,
      journey: 0,
    }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  public satPrice: Price = {
      night: 0,
      day: 0,
      journey: 0,
    }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  public sunPrice: Price = {
      night: 0,
      day: 0,
      journey: 0,
    }
}

export class AvailabilityRessourcePatchQueryDto {}

export class AvailabilityRessourcePatchParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Availability)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class AvailabilityRessourcePatchFilesDto {}

@SkipTransform([['files', AvailabilityRessourcePatchFilesDto]])
export class AvailabilityRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchBodyDto)
  public body: AvailabilityRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchQueryDto)
  public query: AvailabilityRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchParamsDto)
  public params: AvailabilityRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchFilesDto)
  public files: AvailabilityRessourcePatchFilesDto

  public get after () {
    return new AvailabilityRessourcePatchDtoAfter(this)
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

export class AvailabilityRessourcePatchBodyDtoAfter
implements AsSameProperties<AvailabilityRessourcePatchBodyDto> {
  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime

  public monPrice: Price
  public tuePrice: Price
  public wedPrice: Price
  public thuPrice: Price
  public friPrice: Price
  public satPrice: Price
  public sunPrice: Price
}

export class AvailabilityRessourcePatchQueryDtoAfter
implements AsSameProperties<AvailabilityRessourcePatchQueryDto> {}

export class AvailabilityRessourcePatchParamsDtoAfter
implements AsSameProperties<AvailabilityRessourcePatchParamsDto> {
  @Transform(({ value }) => Availability.findOrFail(value))
  @AwaitPromise
  public id: Availability
}

@Exclude()
export class AvailabilityRessourcePatchFilesDtoAfter
implements AsSameProperties<AvailabilityRessourcePatchFilesDto> {}

@SkipTransform([['files', AvailabilityRessourcePatchFilesDtoAfter]])
export class AvailabilityRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<AvailabilityRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchBodyDtoAfter)
  public body: AvailabilityRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchQueryDtoAfter)
  public query: AvailabilityRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchParamsDtoAfter)
  public params: AvailabilityRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchFilesDtoAfter)
  public files: AvailabilityRessourcePatchFilesDtoAfter
}
