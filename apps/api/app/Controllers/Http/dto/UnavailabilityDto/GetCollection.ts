import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UnavailabilityRessourceGetCollectionBodyDto {}

export class UnavailabilityRessourceGetCollectionQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public page?: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public limit?: number
}

export class UnavailabilityRessourceGetCollectionParamsDto {}

@Exclude()
export class UnavailabilityRessourceGetCollectionFilesDto {}

@SkipTransform([['files', UnavailabilityRessourceGetCollectionFilesDto]])
export class UnavailabilityRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionBodyDto)
  public body: UnavailabilityRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionQueryDto)
  public query: UnavailabilityRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionParamsDto)
  public params: UnavailabilityRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionFilesDto)
  public files: UnavailabilityRessourceGetCollectionFilesDto

  public get after () {
    return new UnavailabilityRessourceGetCollectionDtoAfter(this)
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

export class UnavailabilityRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<UnavailabilityRessourceGetCollectionBodyDto> {}

export class UnavailabilityRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<UnavailabilityRessourceGetCollectionQueryDto> {
  public limit?: number
  public page?: number
}

export class UnavailabilityRessourceGetCollectionParamsDtoAfter
implements AsSameProperties<UnavailabilityRessourceGetCollectionParamsDto> {}

@Exclude()
export class UnavailabilityRessourceGetCollectionFilesDtoAfter
implements AsSameProperties<UnavailabilityRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', UnavailabilityRessourceGetCollectionFilesDtoAfter]])
export class UnavailabilityRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UnavailabilityRessourceGetCollectionDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionBodyDtoAfter)
  public body: UnavailabilityRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionQueryDtoAfter)
  public query: UnavailabilityRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionParamsDtoAfter)
  public params: UnavailabilityRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetCollectionFilesDtoAfter)
  public files: UnavailabilityRessourceGetCollectionFilesDtoAfter
}
