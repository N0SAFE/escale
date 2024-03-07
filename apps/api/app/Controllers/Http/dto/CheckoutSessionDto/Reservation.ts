import { IsDefined, IsObject, IsUrl, ValidateNested, ValidationArguments } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import Spa from 'App/Models/Spa'
import { IsAfterNow } from '../Decorator/IsAfterNow'
import { Custom } from '../Decorator/Custom'
import { DateTime } from 'luxon'
import { EntityExist } from '../Decorator/EntityExist'

function checkDateIsAfter (date1: string, args: ValidationArguments) {
  const [relatedPropertyName] = args.constraints
  const self = args.object
  const date2 = self[relatedPropertyName]
  return DateTime.fromISO(date1).toMillis() < DateTime.fromISO(date2).toMillis()
}

export class CheckoutSessionRessourceReservationBodyDto {
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

  public startAt: string
  public endAt: string
}

export class CheckoutSessionRessourceReservationQueryDto {}

export class CheckoutSessionRessourceReservationParamsDto {}

@Exclude()
export class CheckoutSessionRessourceReservationFilesDto {}

@SkipTransform([['files', CheckoutSessionRessourceReservationFilesDto]])
export class CheckoutSessionRessourceReservationDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationBodyDto)
  public body: CheckoutSessionRessourceReservationBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationQueryDto)
  public query: CheckoutSessionRessourceReservationQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationParamsDto)
  public params: CheckoutSessionRessourceReservationParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationFilesDto)
  public files: CheckoutSessionRessourceReservationFilesDto

  public get after () {
    return new CheckoutSessionRessourceReservationDtoAfter(this)
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

export class CheckoutSessionRessourceReservationBodyDtoAfter
implements AsSameProperties<CheckoutSessionRessourceReservationBodyDto> {
  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  public successUrl: string
  public cancelUrl: string

  @Transform(({ value }) => DateTime.fromISO(value))
  @IsAfterNow()
  @Custom('endAt', {
    function: checkDateIsAfter,
    message: 'startAt must be before endAt',
  })
  public startAt: DateTime

  @Transform(({ value }) => DateTime.fromISO(value))
  @IsAfterNow()
  public endAt: DateTime
}

export class CheckoutSessionRessourceReservationQueryDtoAfter
implements AsSameProperties<CheckoutSessionRessourceReservationQueryDto> {}

export class CheckoutSessionRessourceReservationParamsDtoAfter
implements AsSameProperties<CheckoutSessionRessourceReservationParamsDto> {}

@Exclude()
export class CheckoutSessionRessourceReservationFilesDtoAfter
implements AsSameProperties<CheckoutSessionRessourceReservationFilesDto> {}

@SkipTransform([['files', CheckoutSessionRessourceReservationFilesDtoAfter]])
export class CheckoutSessionRessourceReservationDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<CheckoutSessionRessourceReservationDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationBodyDtoAfter)
  public body: CheckoutSessionRessourceReservationBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationQueryDtoAfter)
  public query: CheckoutSessionRessourceReservationQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationParamsDtoAfter)
  public params: CheckoutSessionRessourceReservationParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckoutSessionRessourceReservationFilesDtoAfter)
  public files: CheckoutSessionRessourceReservationFilesDtoAfter
}
