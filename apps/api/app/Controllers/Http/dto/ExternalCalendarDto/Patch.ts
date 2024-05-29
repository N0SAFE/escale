import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class ExternalCalendarRessourcePatchBodyDto {}

export class ExternalCalendarRessourcePatchQueryDto {}

export class ExternalCalendarRessourcePatchParamsDto {}

@Exclude()
export class ExternalCalendarRessourcePatchFilesDto {}

@SkipTransform([['files', ExternalCalendarRessourcePatchFilesDto]])
export class ExternalCalendarRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchBodyDto)
  public body: ExternalCalendarRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchQueryDto)
  public query: ExternalCalendarRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchParamsDto)
  public params: ExternalCalendarRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchFilesDto)
  public files: ExternalCalendarRessourcePatchFilesDto

  public get after() {
    return new ExternalCalendarRessourcePatchDtoAfter(this)
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

export class ExternalCalendarRessourcePatchBodyDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePatchBodyDto> {}

export class ExternalCalendarRessourcePatchQueryDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePatchQueryDto> {}

export class ExternalCalendarRessourcePatchParamsDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePatchParamsDto> {}

@Exclude()
export class ExternalCalendarRessourcePatchFilesDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePatchFilesDto> {}

@SkipTransform([['files', ExternalCalendarRessourcePatchFilesDtoAfter]])
export class ExternalCalendarRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarRessourcePatchDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchBodyDtoAfter)
  public body: ExternalCalendarRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchQueryDtoAfter)
  public query: ExternalCalendarRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchParamsDtoAfter)
  public params: ExternalCalendarRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePatchFilesDtoAfter)
  public files: ExternalCalendarRessourcePatchFilesDtoAfter
}
