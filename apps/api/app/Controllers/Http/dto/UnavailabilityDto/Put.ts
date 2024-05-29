import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UnavailabilityRessourcePutBodyDto {}

export class UnavailabilityRessourcePutQueryDto {}

export class UnavailabilityRessourcePutParamsDto {}

@Exclude()
export class UnavailabilityRessourcePutFilesDto {}

@SkipTransform([['files', UnavailabilityRessourcePutFilesDto]])
export class UnavailabilityRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutBodyDto)
  public body: UnavailabilityRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutQueryDto)
  public query: UnavailabilityRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutParamsDto)
  public params: UnavailabilityRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutFilesDto)
  public files: UnavailabilityRessourcePutFilesDto

  public get after() {
    return new UnavailabilityRessourcePutDtoAfter(this)
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

export class UnavailabilityRessourcePutBodyDtoAfter
  implements AsSameProperties<UnavailabilityRessourcePutBodyDto> {}

export class UnavailabilityRessourcePutQueryDtoAfter
  implements AsSameProperties<UnavailabilityRessourcePutQueryDto> {}

export class UnavailabilityRessourcePutParamsDtoAfter
  implements AsSameProperties<UnavailabilityRessourcePutParamsDto> {}

@Exclude()
export class UnavailabilityRessourcePutFilesDtoAfter
  implements AsSameProperties<UnavailabilityRessourcePutFilesDto> {}

@SkipTransform([['files', UnavailabilityRessourcePutFilesDtoAfter]])
export class UnavailabilityRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UnavailabilityRessourcePutDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutBodyDtoAfter)
  public body: UnavailabilityRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutQueryDtoAfter)
  public query: UnavailabilityRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutParamsDtoAfter)
  public params: UnavailabilityRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourcePutFilesDtoAfter)
  public files: UnavailabilityRessourcePutFilesDtoAfter
}
