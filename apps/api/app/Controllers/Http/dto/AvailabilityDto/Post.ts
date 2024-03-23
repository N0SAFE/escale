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
import { DateTime } from 'luxon'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { Custom } from '../Decorator/Custom'
import { AwaitPromise } from '../Decorator/AwaitPromise'

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

export class AvailabilityRessourcePostBodyDto {
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

export class AvailabilityRessourcePostQueryDto {}

export class AvailabilityRessourcePostParamsDto {}

@Exclude()
export class AvailabilityRessourcePostFilesDto {}

@SkipTransform([['files', AvailabilityRessourcePostFilesDto]])
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

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostParamsDto)
  public params: AvailabilityRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostFilesDto)
  public files: AvailabilityRessourcePostFilesDto

  public get after () {
    return new AvailabilityRessourcePostDtoAfter(this)
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

export class AvailabilityRessourcePostBodyDtoAfter
implements AsSameProperties<AvailabilityRessourcePostBodyDto> {
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

export class AvailabilityRessourcePostQueryDtoAfter
implements AsSameProperties<AvailabilityRessourcePostQueryDto> {}

export class AvailabilityRessourcePostParamsDtoAfter
implements AsSameProperties<AvailabilityRessourcePostParamsDto> {}

@Exclude()
export class AvailabilityRessourcePostFilesDtoAfter
implements AsSameProperties<AvailabilityRessourcePostFilesDto> {}

@SkipTransform([['files', AvailabilityRessourcePostFilesDtoAfter]])
export class AvailabilityRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<AvailabilityRessourcePostDto, 'after'>> {
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

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostParamsDtoAfter)
  public params: AvailabilityRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePostFilesDtoAfter)
  public files: AvailabilityRessourcePostFilesDtoAfter
}
