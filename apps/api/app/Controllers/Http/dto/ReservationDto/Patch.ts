import {
  IsDefined,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Reservation from 'App/Models/Reservation'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import Spa from 'App/Models/Spa'

function checkDateIsAfter(date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() <= DateTime.fromISO(date2).toMillis()
}

export class ReservationRessourcePatchBodyDto {
  @IsDefined()
  @EntityExist(Spa)
  public spaId: number

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

  @IsOptional()
  @IsString()
  public notes?: string
}

export class ReservationRessourcePatchQueryDto {}

export class ReservationRessourcePatchParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(Reservation)
  public id: number
}

@Exclude()
export class ReservationRessourcePatchFilesDto {}

@SkipTransform([['files', ReservationRessourcePatchFilesDto]])
export class ReservationRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchBodyDto)
  public body: ReservationRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchQueryDto)
  public query: ReservationRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchParamsDto)
  public params: ReservationRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchFilesDto)
  public files: ReservationRessourcePatchFilesDto

  public get after() {
    return new ReservationRessourcePatchDtoAfter(this)
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

export class ReservationRessourcePatchBodyDtoAfter
  implements AsSameProperties<ReservationRessourcePatchBodyDto>
{
  public spaId: number

  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime

  public notes?: string
}

export class ReservationRessourcePatchQueryDtoAfter
  implements AsSameProperties<ReservationRessourcePatchQueryDto> {}

export class ReservationRessourcePatchParamsDtoAfter
  implements AsSameProperties<ReservationRessourcePatchParamsDto>
{
  @Transform(({ value }) => Reservation.findOrFail(value))
  @AwaitPromise
  public id: Reservation
}

@Exclude()
export class ReservationRessourcePatchFilesDtoAfter
  implements AsSameProperties<ReservationRessourcePatchFilesDto> {}

@SkipTransform([['files', ReservationRessourcePatchFilesDtoAfter]])
export class ReservationRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourcePatchDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchBodyDtoAfter)
  public body: ReservationRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchQueryDtoAfter)
  public query: ReservationRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchParamsDtoAfter)
  public params: ReservationRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePatchFilesDtoAfter)
  public files: ReservationRessourcePatchFilesDtoAfter
}
