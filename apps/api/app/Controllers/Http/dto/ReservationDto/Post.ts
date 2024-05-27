import {
  IsDefined,
  IsISO8601,
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
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import Spa from 'App/Models/Spa'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() <= DateTime.fromISO(date2).toMillis()
}

export class ReservationRessourcePostBodyDto {
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

export class ReservationRessourcePostQueryDto {}

export class ReservationRessourcePostParamsDto {}

@Exclude()
export class ReservationRessourcePostFilesDto {}

@SkipTransform([['files', ReservationRessourcePostFilesDto]])
export class ReservationRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostBodyDto)
  public body: ReservationRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostQueryDto)
  public query: ReservationRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostParamsDto)
  public params: ReservationRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostFilesDto)
  public files: ReservationRessourcePostFilesDto

  public get after () {
    return new ReservationRessourcePostDtoAfter(this)
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

export class ReservationRessourcePostBodyDtoAfter
implements AsSameProperties<ReservationRessourcePostBodyDto> {
  public spaId: number

  @Transform(({ value }) => DateTime.fromISO(value))
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  public endAt: DateTime

  public notes?: string
}

export class ReservationRessourcePostQueryDtoAfter
implements AsSameProperties<ReservationRessourcePostQueryDto> {}

export class ReservationRessourcePostParamsDtoAfter
implements AsSameProperties<ReservationRessourcePostParamsDto> {}

@Exclude()
export class ReservationRessourcePostFilesDtoAfter
implements AsSameProperties<ReservationRessourcePostFilesDto> {}

@SkipTransform([['files', ReservationRessourcePostFilesDtoAfter]])
export class ReservationRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostBodyDtoAfter)
  public body: ReservationRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostQueryDtoAfter)
  public query: ReservationRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostParamsDtoAfter)
  public params: ReservationRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourcePostFilesDtoAfter)
  public files: ReservationRessourcePostFilesDtoAfter
}
