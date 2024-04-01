import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UnavailabilityRessourceDeleteBodyDto {}

export class UnavailabilityRessourceDeleteQueryDto {}

export class UnavailabilityRessourceDeleteParamsDto {}

@Exclude()
export class UnavailabilityRessourceDeleteFilesDto {}

@SkipTransform([['files', UnavailabilityRessourceDeleteFilesDto]])
export class UnavailabilityRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteBodyDto)
  public body: UnavailabilityRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteQueryDto)
  public query: UnavailabilityRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteParamsDto)
  public params: UnavailabilityRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteFilesDto)
  public files: UnavailabilityRessourceDeleteFilesDto

  public get after () {
    return new UnavailabilityRessourceDeleteDtoAfter(this)
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

export class UnavailabilityRessourceDeleteBodyDtoAfter
implements AsSameProperties<UnavailabilityRessourceDeleteBodyDto> {}

export class UnavailabilityRessourceDeleteQueryDtoAfter
implements AsSameProperties<UnavailabilityRessourceDeleteQueryDto> {}

export class UnavailabilityRessourceDeleteParamsDtoAfter
implements AsSameProperties<UnavailabilityRessourceDeleteParamsDto> {}

@Exclude()
export class UnavailabilityRessourceDeleteFilesDtoAfter
implements AsSameProperties<UnavailabilityRessourceDeleteFilesDto> {}

@SkipTransform([['files', UnavailabilityRessourceDeleteFilesDtoAfter]])
export class UnavailabilityRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UnavailabilityRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteBodyDtoAfter)
  public body: UnavailabilityRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteQueryDtoAfter)
  public query: UnavailabilityRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteParamsDtoAfter)
  public params: UnavailabilityRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceDeleteFilesDtoAfter)
  public files: UnavailabilityRessourceDeleteFilesDtoAfter
}
