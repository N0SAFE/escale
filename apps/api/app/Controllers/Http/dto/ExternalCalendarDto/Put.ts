import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class ExternalCalendarRessourcePutBodyDto {}

export class ExternalCalendarRessourcePutQueryDto {}

export class ExternalCalendarRessourcePutParamsDto {}

@Exclude()
export class ExternalCalendarRessourcePutFilesDto {}

@SkipTransform([['files', ExternalCalendarRessourcePutFilesDto]])
export class ExternalCalendarRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutBodyDto)
  public body: ExternalCalendarRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutQueryDto)
  public query: ExternalCalendarRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutParamsDto)
  public params: ExternalCalendarRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutFilesDto)
  public files: ExternalCalendarRessourcePutFilesDto

  public get after() {
    return new ExternalCalendarRessourcePutDtoAfter(this)
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

export class ExternalCalendarRessourcePutBodyDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePutBodyDto> {}

export class ExternalCalendarRessourcePutQueryDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePutQueryDto> {}

export class ExternalCalendarRessourcePutParamsDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePutParamsDto> {}

@Exclude()
export class ExternalCalendarRessourcePutFilesDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePutFilesDto> {}

@SkipTransform([['files', ExternalCalendarRessourcePutFilesDtoAfter]])
export class ExternalCalendarRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarRessourcePutDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutBodyDtoAfter)
  public body: ExternalCalendarRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutQueryDtoAfter)
  public query: ExternalCalendarRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutParamsDtoAfter)
  public params: ExternalCalendarRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePutFilesDtoAfter)
  public files: ExternalCalendarRessourcePutFilesDtoAfter
}
