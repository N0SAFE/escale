import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import Reservation from 'App/Models/Reservation'
import { EntityExist } from '../Decorator/EntityExist'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class ReservationRessourceGetBodyDto {}

export class ReservationRessourceGetQueryDto {}

export class ReservationRessourceGetParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(Reservation)
  public id: number
}

@Exclude()
export class ReservationRessourceGetFilesDto {}

@SkipTransform([['files', ReservationRessourceGetFilesDto]])
export class ReservationRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetBodyDto)
  public body: ReservationRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetQueryDto)
  public query: ReservationRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetParamsDto)
  public params: ReservationRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetFilesDto)
  public files: ReservationRessourceGetFilesDto

  public get after() {
    return new ReservationRessourceGetDtoAfter(this)
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

export class ReservationRessourceGetBodyDtoAfter
  implements AsSameProperties<ReservationRessourceGetBodyDto> {}

export class ReservationRessourceGetQueryDtoAfter
  implements AsSameProperties<ReservationRessourceGetQueryDto> {}

export class ReservationRessourceGetParamsDtoAfter
  implements AsSameProperties<ReservationRessourceGetParamsDto>
{
  @Transform(({ value }) => Reservation.findOrFail(value))
  @AwaitPromise
  public id: Reservation
}

@Exclude()
export class ReservationRessourceGetFilesDtoAfter
  implements AsSameProperties<ReservationRessourceGetFilesDto> {}

@SkipTransform([['files', ReservationRessourceGetFilesDtoAfter]])
export class ReservationRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourceGetDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetBodyDtoAfter)
  public body: ReservationRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetQueryDtoAfter)
  public query: ReservationRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetParamsDtoAfter)
  public params: ReservationRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetFilesDtoAfter)
  public files: ReservationRessourceGetFilesDtoAfter
}
