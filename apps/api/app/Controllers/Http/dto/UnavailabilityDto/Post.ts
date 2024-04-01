import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UnavailabilityRessourcePostBodyDto {}

export class UnavailabilityRessourcePostQueryDto {}

export class UnavailabilityRessourcePostParamsDto {}

@Exclude()
export class UnavailabilityRessourcePostFilesDto {}

@SkipTransform([['files', UnavailabilityRessourcePostFilesDto]])
export class UnavailabilityRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostBodyDto)
  public body: UnavailabilityRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostQueryDto)
  public query: UnavailabilityRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostParamsDto)
  public params: UnavailabilityRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostFilesDto)
  public files: UnavailabilityRessourcePostFilesDto

  public get after () {
    return new UnavailabilityRessourcePostDtoAfter(this)
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

export class UnavailabilityRessourcePostBodyDtoAfter
implements AsSameProperties<UnavailabilityRessourcePostBodyDto> {}

export class UnavailabilityRessourcePostQueryDtoAfter
implements AsSameProperties<UnavailabilityRessourcePostQueryDto> {}

export class UnavailabilityRessourcePostParamsDtoAfter
implements AsSameProperties<UnavailabilityRessourcePostParamsDto> {}

@Exclude()
export class UnavailabilityRessourcePostFilesDtoAfter
implements AsSameProperties<UnavailabilityRessourcePostFilesDto> {}

@SkipTransform([['files', UnavailabilityRessourcePostFilesDtoAfter]])
export class UnavailabilityRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UnavailabilityRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostBodyDtoAfter)
  public body: UnavailabilityRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostQueryDtoAfter)
  public query: UnavailabilityRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostParamsDtoAfter)
  public params: UnavailabilityRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePostFilesDtoAfter)
  public files: UnavailabilityRessourcePostFilesDtoAfter
}
