import {
  IsBoolean,
  IsDefined,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { DateTime } from 'luxon'

export class ReservationRessourceClosestUnreservableBodyDto {}

export class ReservationRessourceClosestUnreservableQueryDto {
  @EntityExist(Spa)
  @IsDefined()
  @Type(() => Number)
  public spa: number

  @IsString()
  @IsISO8601()
  public date: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'enabled', 'true'].includes(value))
  public includeExternalBlockedCalendarEvents: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'enabled', 'true'].includes(value))
  public includeExternalReservedCalendarEvents: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'enabled', 'true'].includes(value))
  public includeUnavailabilities: boolean

  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  public avoidIds: number[] = []
}

export class ReservationRessourceClosestUnreservableParamsDto {}

@Exclude()
export class ReservationRessourceClosestUnreservableFilesDto {}

@SkipTransform([['files', ReservationRessourceClosestUnreservableFilesDto]])
export class ReservationRessourceClosestUnreservableDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableBodyDto)
  public body: ReservationRessourceClosestUnreservableBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableQueryDto)
  public query: ReservationRessourceClosestUnreservableQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableParamsDto)
  public params: ReservationRessourceClosestUnreservableParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableFilesDto)
  public files: ReservationRessourceClosestUnreservableFilesDto

  public get after () {
    return new ReservationRessourceClosestUnreservableDtoAfter(this)
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

export class ReservationRessourceClosestUnreservableBodyDtoAfter
implements AsSameProperties<ReservationRessourceClosestUnreservableBodyDto> {}

export class ReservationRessourceClosestUnreservableQueryDtoAfter
implements AsSameProperties<ReservationRessourceClosestUnreservableQueryDto> {
  @Transform(({ value }) => Spa.firstOrFail(value))
  @AwaitPromise
  public spa: Spa

  @Transform(({ value }) => DateTime.fromISO(value))
  public date: DateTime

  public includeExternalBlockedCalendarEvents: boolean
  public includeExternalReservedCalendarEvents: boolean
  public includeUnavailabilities: boolean

  public avoidIds: number[]
}

export class ReservationRessourceClosestUnreservableParamsDtoAfter
implements AsSameProperties<ReservationRessourceClosestUnreservableParamsDto> {}

@Exclude()
export class ReservationRessourceClosestUnreservableFilesDtoAfter
implements AsSameProperties<ReservationRessourceClosestUnreservableFilesDto> {}

@SkipTransform([['files', ReservationRessourceClosestUnreservableFilesDtoAfter]])
export class ReservationRessourceClosestUnreservableDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourceClosestUnreservableDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableBodyDtoAfter)
  public body: ReservationRessourceClosestUnreservableBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableQueryDtoAfter)
  public query: ReservationRessourceClosestUnreservableQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableParamsDtoAfter)
  public params: ReservationRessourceClosestUnreservableParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceClosestUnreservableFilesDtoAfter)
  public files: ReservationRessourceClosestUnreservableFilesDtoAfter
}
