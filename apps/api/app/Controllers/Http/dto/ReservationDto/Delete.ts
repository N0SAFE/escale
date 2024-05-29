import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Reservation from 'App/Models/Reservation'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class ReservationRessourceDeleteBodyDto {}

export class ReservationRessourceDeleteQueryDto {}

export class ReservationRessourceDeleteParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(Reservation)
  public id: number
}

@Exclude()
export class ReservationRessourceDeleteFilesDto {}

@SkipTransform([['files', ReservationRessourceDeleteFilesDto]])
export class ReservationRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteBodyDto)
  public body: ReservationRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteQueryDto)
  public query: ReservationRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteParamsDto)
  public params: ReservationRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteFilesDto)
  public files: ReservationRessourceDeleteFilesDto

  public get after() {
    return new ReservationRessourceDeleteDtoAfter(this)
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

export class ReservationRessourceDeleteBodyDtoAfter
  implements AsSameProperties<ReservationRessourceDeleteBodyDto> {}

export class ReservationRessourceDeleteQueryDtoAfter
  implements AsSameProperties<ReservationRessourceDeleteQueryDto> {}

export class ReservationRessourceDeleteParamsDtoAfter
  implements AsSameProperties<ReservationRessourceDeleteParamsDto>
{
  @Transform(({ value }) => Reservation.findOrFail(value))
  @AwaitPromise
  public id: Reservation
}

@Exclude()
export class ReservationRessourceDeleteFilesDtoAfter
  implements AsSameProperties<ReservationRessourceDeleteFilesDto> {}

@SkipTransform([['files', ReservationRessourceDeleteFilesDtoAfter]])
export class ReservationRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourceDeleteDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteBodyDtoAfter)
  public body: ReservationRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteQueryDtoAfter)
  public query: ReservationRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteParamsDtoAfter)
  public params: ReservationRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceDeleteFilesDtoAfter)
  public files: ReservationRessourceDeleteFilesDtoAfter
}
