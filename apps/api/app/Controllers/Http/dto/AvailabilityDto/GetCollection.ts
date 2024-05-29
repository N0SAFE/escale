import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class AvailabilityRessourceGetCollectionBodyDto {}

export class AvailabilityRessourceGetCollectionQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public page?: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public limit?: number
}

export class AvailabilityRessourceGetCollectionParamsDto {}

@Exclude()
export class AvailabilityRessourceGetCollectionFilesDto {}

@SkipTransform([['files', AvailabilityRessourceGetCollectionFilesDto]])
export class AvailabilityRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionBodyDto)
  public body: AvailabilityRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionQueryDto)
  public query: AvailabilityRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionParamsDto)
  public params: AvailabilityRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionFilesDto)
  public files: AvailabilityRessourceGetCollectionFilesDto

  public get after() {
    return new AvailabilityRessourceGetCollectionDtoAfter(this)
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

export class AvailabilityRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetCollectionBodyDto> {}

export class AvailabilityRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetCollectionQueryDto>
{
  public page?: number
  public limit?: number
}

export class AvailabilityRessourceGetCollectionParamsDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetCollectionParamsDto> {}

@Exclude()
export class AvailabilityRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<AvailabilityRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', AvailabilityRessourceGetCollectionFilesDtoAfter]])
export class AvailabilityRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<AvailabilityRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionBodyDtoAfter)
  public body: AvailabilityRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionQueryDtoAfter)
  public query: AvailabilityRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionParamsDtoAfter)
  public params: AvailabilityRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionFilesDtoAfter)
  public files: AvailabilityRessourceGetCollectionFilesDtoAfter
}
