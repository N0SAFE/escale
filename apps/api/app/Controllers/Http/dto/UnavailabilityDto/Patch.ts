import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UnavailabilityRessourcePatchBodyDto {}

export class UnavailabilityRessourcePatchQueryDto {}

export class UnavailabilityRessourcePatchParamsDto {}

@Exclude()
export class UnavailabilityRessourcePatchFilesDto {}

@SkipTransform([['files', UnavailabilityRessourcePatchFilesDto]])
export class UnavailabilityRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchBodyDto)
  public body: UnavailabilityRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchQueryDto)
  public query: UnavailabilityRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchParamsDto)
  public params: UnavailabilityRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchFilesDto)
  public files: UnavailabilityRessourcePatchFilesDto

  public get after () {
    return new UnavailabilityRessourcePatchDtoAfter(this)
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

export class UnavailabilityRessourcePatchBodyDtoAfter
implements AsSameProperties<UnavailabilityRessourcePatchBodyDto> {}

export class UnavailabilityRessourcePatchQueryDtoAfter
implements AsSameProperties<UnavailabilityRessourcePatchQueryDto> {}

export class UnavailabilityRessourcePatchParamsDtoAfter
implements AsSameProperties<UnavailabilityRessourcePatchParamsDto> {}

@Exclude()
export class UnavailabilityRessourcePatchFilesDtoAfter
implements AsSameProperties<UnavailabilityRessourcePatchFilesDto> {}

@SkipTransform([['files', UnavailabilityRessourcePatchFilesDtoAfter]])
export class UnavailabilityRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UnavailabilityRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchBodyDtoAfter)
  public body: UnavailabilityRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchQueryDtoAfter)
  public query: UnavailabilityRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchParamsDtoAfter)
  public params: UnavailabilityRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePatchFilesDtoAfter)
  public files: UnavailabilityRessourcePatchFilesDtoAfter
}
