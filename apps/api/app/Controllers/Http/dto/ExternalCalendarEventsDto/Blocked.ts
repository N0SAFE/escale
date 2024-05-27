import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import { EntityExist } from '../Decorator/EntityExist'

export class ExternalCalendarEventsRessourceBlockedBodyDto {}

export class ExternalCalendarEventsRessourceBlockedQueryDto {}

export class ExternalCalendarEventsRessourceBlockedParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(ExternalCalendar)
  public externalCalendar: number
}

@Exclude()
export class ExternalCalendarEventsRessourceBlockedFilesDto {}

@SkipTransform([['files', ExternalCalendarEventsRessourceBlockedFilesDto]])
export class ExternalCalendarEventsRessourceBlockedDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedBodyDto)
  public body: ExternalCalendarEventsRessourceBlockedBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedQueryDto)
  public query: ExternalCalendarEventsRessourceBlockedQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedParamsDto)
  public params: ExternalCalendarEventsRessourceBlockedParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedFilesDto)
  public files: ExternalCalendarEventsRessourceBlockedFilesDto

  public get after () {
    return new ExternalCalendarEventsRessourceBlockedDtoAfter(this)
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

export class ExternalCalendarEventsRessourceBlockedBodyDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceBlockedBodyDto> {}

export class ExternalCalendarEventsRessourceBlockedQueryDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceBlockedQueryDto> {}

export class ExternalCalendarEventsRessourceBlockedParamsDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceBlockedParamsDto> {
  @Transform(({ value }) => ExternalCalendar.findOrFail(value))
  @AwaitPromise
  public externalCalendar: ExternalCalendar
}

@Exclude()
export class ExternalCalendarEventsRessourceBlockedFilesDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceBlockedFilesDto> {}

@SkipTransform([['files', ExternalCalendarEventsRessourceBlockedFilesDtoAfter]])
export class ExternalCalendarEventsRessourceBlockedDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarEventsRessourceBlockedDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedBodyDtoAfter)
  public body: ExternalCalendarEventsRessourceBlockedBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedQueryDtoAfter)
  public query: ExternalCalendarEventsRessourceBlockedQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedParamsDtoAfter)
  public params: ExternalCalendarEventsRessourceBlockedParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceBlockedFilesDtoAfter)
  public files: ExternalCalendarEventsRessourceBlockedFilesDtoAfter
}
