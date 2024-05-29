import {
  IsDefined,
  IsISO8601,
  IsObject,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { Custom } from '../Decorator/Custom'

function checkDateIsAfter(date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() <= DateTime.fromISO(date2).toMillis()
}

export class ReservationRessourcePriceBodyDto {}

export class ReservationRessourcePriceQueryDto {
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

export class ReservationRessourcePriceParamsDto {}

@Exclude()
export class ReservationRessourcePriceFilesDto {}

@SkipTransform([['files', ReservationRessourcePriceFilesDto]])
export class ReservationRessourcePriceDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceBodyDto)
  public body: ReservationRessourcePriceBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceQueryDto)
  public query: ReservationRessourcePriceQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceParamsDto)
  public params: ReservationRessourcePriceParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceFilesDto)
  public files: ReservationRessourcePriceFilesDto

  public get after() {
    return new ReservationRessourcePriceDtoAfter(this)
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

export class ReservationRessourcePriceBodyDtoAfter
  implements AsSameProperties<ReservationRessourcePriceBodyDto> {}

export class ReservationRessourcePriceQueryDtoAfter
  implements AsSameProperties<ReservationRessourcePriceQueryDto>
{
  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime

  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa
}

export class ReservationRessourcePriceParamsDtoAfter
  implements AsSameProperties<ReservationRessourcePriceParamsDto> {}

@Exclude()
export class ReservationRessourcePriceFilesDtoAfter
  implements AsSameProperties<ReservationRessourcePriceFilesDto> {}

@SkipTransform([['files', ReservationRessourcePriceFilesDtoAfter]])
export class ReservationRessourcePriceDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourcePriceDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceBodyDtoAfter)
  public body: ReservationRessourcePriceBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceQueryDtoAfter)
  public query: ReservationRessourcePriceQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceParamsDtoAfter)
  public params: ReservationRessourcePriceParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePriceFilesDtoAfter)
  public files: ReservationRessourcePriceFilesDtoAfter
}
