import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class ExternalCalendarRessourceDeleteBodyDto {}

export class ExternalCalendarRessourceDeleteQueryDto {}

export class ExternalCalendarRessourceDeleteParamsDto {}

@Exclude()
export class ExternalCalendarRessourceDeleteFilesDto {}

@SkipTransform([['files', ExternalCalendarRessourceDeleteFilesDto]])
export class ExternalCalendarRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteBodyDto)
  public body: ExternalCalendarRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteQueryDto)
  public query: ExternalCalendarRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteParamsDto)
  public params: ExternalCalendarRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteFilesDto)
  public files: ExternalCalendarRessourceDeleteFilesDto

  public get after () {
    return new ExternalCalendarRessourceDeleteDtoAfter(this)
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

export class ExternalCalendarRessourceDeleteBodyDtoAfter
implements AsSameProperties<ExternalCalendarRessourceDeleteBodyDto> {}

export class ExternalCalendarRessourceDeleteQueryDtoAfter
implements AsSameProperties<ExternalCalendarRessourceDeleteQueryDto> {}

export class ExternalCalendarRessourceDeleteParamsDtoAfter
implements AsSameProperties<ExternalCalendarRessourceDeleteParamsDto> {}

@Exclude()
export class ExternalCalendarRessourceDeleteFilesDtoAfter
implements AsSameProperties<ExternalCalendarRessourceDeleteFilesDto> {}

@SkipTransform([['files', ExternalCalendarRessourceDeleteFilesDtoAfter]])
export class ExternalCalendarRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteBodyDtoAfter)
  public body: ExternalCalendarRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteQueryDtoAfter)
  public query: ExternalCalendarRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteParamsDtoAfter)
  public params: ExternalCalendarRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceDeleteFilesDtoAfter)
  public files: ExternalCalendarRessourceDeleteFilesDtoAfter
}
