import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class ReservationRessourceGetCollectionBodyDto {}

export class ReservationRessourceGetCollectionQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public page?: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public limit?: number
}

export class ReservationRessourceGetCollectionParamsDto {}

@Exclude()
export class ReservationRessourceGetCollectionFilesDto {}

@SkipTransform([['files', ReservationRessourceGetCollectionFilesDto]])
export class ReservationRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionBodyDto)
  public body: ReservationRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionQueryDto)
  public query: ReservationRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionParamsDto)
  public params: ReservationRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionFilesDto)
  public files: ReservationRessourceGetCollectionFilesDto

  public get after() {
    return new ReservationRessourceGetCollectionDtoAfter(this)
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

export class ReservationRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<ReservationRessourceGetCollectionBodyDto> {}

export class ReservationRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<ReservationRessourceGetCollectionQueryDto>
{
  public page?: number
  public limit?: number
}

export class ReservationRessourceGetCollectionParamsDtoAfter
  implements AsSameProperties<ReservationRessourceGetCollectionParamsDto> {}

@Exclude()
export class ReservationRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<ReservationRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', ReservationRessourceGetCollectionFilesDtoAfter]])
export class ReservationRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ReservationRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionBodyDtoAfter)
  public body: ReservationRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionQueryDtoAfter)
  public query: ReservationRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionParamsDtoAfter)
  public params: ReservationRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationRessourceGetCollectionFilesDtoAfter)
  public files: ReservationRessourceGetCollectionFilesDtoAfter
}
