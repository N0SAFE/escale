import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UnavailabilityRessourceGetBodyDto {}

export class UnavailabilityRessourceGetQueryDto {}

export class UnavailabilityRessourceGetParamsDto {}

@Exclude()
export class UnavailabilityRessourceGetFilesDto {}

@SkipTransform([['files', UnavailabilityRessourceGetFilesDto]])
export class UnavailabilityRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetBodyDto)
  public body: UnavailabilityRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetQueryDto)
  public query: UnavailabilityRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetParamsDto)
  public params: UnavailabilityRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetFilesDto)
  public files: UnavailabilityRessourceGetFilesDto

  public get after() {
    return new UnavailabilityRessourceGetDtoAfter(this)
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

export class UnavailabilityRessourceGetBodyDtoAfter
  implements AsSameProperties<UnavailabilityRessourceGetBodyDto> {}

export class UnavailabilityRessourceGetQueryDtoAfter
  implements AsSameProperties<UnavailabilityRessourceGetQueryDto> {}

export class UnavailabilityRessourceGetParamsDtoAfter
  implements AsSameProperties<UnavailabilityRessourceGetParamsDto> {}

@Exclude()
export class UnavailabilityRessourceGetFilesDtoAfter
  implements AsSameProperties<UnavailabilityRessourceGetFilesDto> {}

@SkipTransform([['files', UnavailabilityRessourceGetFilesDtoAfter]])
export class UnavailabilityRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UnavailabilityRessourceGetDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetBodyDtoAfter)
  public body: UnavailabilityRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetQueryDtoAfter)
  public query: UnavailabilityRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetParamsDtoAfter)
  public params: UnavailabilityRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UnavailabilityRessourceGetFilesDtoAfter)
  public files: UnavailabilityRessourceGetFilesDtoAfter
}
