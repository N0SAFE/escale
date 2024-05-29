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
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { AwaitPromise } from '../Decorator/AwaitPromise'

function checkDateIsAfter(date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  const dateTime1 = DateTime.fromISO(date1)
  const dateTime2 = DateTime.fromISO(date2)
  return dateTime1.toMillis() <= dateTime2.toMillis()
}

function checkDateHasLessThan150DayDifference(date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  const dateTime1 = DateTime.fromISO(date1)
  const dateTime2 = DateTime.fromISO(date2)
  return dateTime2.diff(dateTime1, 'days').days <= 150
}

export class AvailabilityRessourceGetAvailableDatesBodyDto {}

export class AvailabilityRessourceGetAvailableDatesQueryDto {
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
  @Custom('to', {
    function: checkDateHasLessThan150DayDifference,
    message: 'from and to must have less than 150 days between them',
  })
  public from: string

  @IsDefined()
  @IsISO8601()
  public to: string

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public includeExternalBlockedDates: boolean = true

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public includeExternalReservedDates: boolean = true
}

export class AvailabilityRessourceGetAvailableDatesParamsDto {}

@Exclude()
export class AvailabilityRessourceGetAvailableDatesFilesDto {}

@SkipTransform([['files', AvailabilityRessourceGetAvailableDatesFilesDto]])
export class AvailabilityRessourceGetAvailableDatesDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesBodyDto)
  public body: AvailabilityRessourceGetAvailableDatesBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesQueryDto)
  public query: AvailabilityRessourceGetAvailableDatesQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesParamsDto)
  public params: AvailabilityRessourceGetAvailableDatesParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesFilesDto)
  public files: AvailabilityRessourceGetAvailableDatesFilesDto

  public get after() {
    return new AvailabilityRessourceGetAvailableDatesDtoAfter(this)
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

export class AvailabilityRessourceGetAvailableDatesBodyDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetAvailableDatesBodyDto> {}

export class AvailabilityRessourceGetAvailableDatesQueryDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetAvailableDatesQueryDto>
{
  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  @Transform(({ value }) => DateTime.fromISO(value))
  public from: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public to: DateTime

  public includeExternalBlockedDates: boolean
  public includeExternalReservedDates: boolean
}

export class AvailabilityRessourceGetAvailableDatesParamsDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetAvailableDatesParamsDto> {}

@Exclude()
export class AvailabilityRessourceGetAvailableDatesFilesDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetAvailableDatesFilesDto> {}

@SkipTransform([['files', AvailabilityRessourceGetAvailableDatesFilesDtoAfter]])
export class AvailabilityRessourceGetAvailableDatesDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<AvailabilityRessourceGetAvailableDatesDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesBodyDtoAfter)
  public body: AvailabilityRessourceGetAvailableDatesBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesQueryDtoAfter)
  public query: AvailabilityRessourceGetAvailableDatesQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesParamsDtoAfter)
  public params: AvailabilityRessourceGetAvailableDatesParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetAvailableDatesFilesDtoAfter)
  public files: AvailabilityRessourceGetAvailableDatesFilesDtoAfter
}
