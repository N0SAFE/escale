import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { EntityExist } from '../Decorator/EntityExist'

export class ExternalCalendarEventsRessourceReservedBodyDto {}

export class ExternalCalendarEventsRessourceReservedQueryDto {}

export class ExternalCalendarEventsRessourceReservedParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(ExternalCalendar)
  public externalCalendar: number
}

@Exclude()
export class ExternalCalendarEventsRessourceReservedFilesDto {}

@SkipTransform([['files', ExternalCalendarEventsRessourceReservedFilesDto]])
export class ExternalCalendarEventsRessourceReservedDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedBodyDto)
  public body: ExternalCalendarEventsRessourceReservedBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedQueryDto)
  public query: ExternalCalendarEventsRessourceReservedQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedParamsDto)
  public params: ExternalCalendarEventsRessourceReservedParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedFilesDto)
  public files: ExternalCalendarEventsRessourceReservedFilesDto

  public get after () {
    return new ExternalCalendarEventsRessourceReservedDtoAfter(this)
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

export class ExternalCalendarEventsRessourceReservedBodyDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceReservedBodyDto> {}

export class ExternalCalendarEventsRessourceReservedQueryDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceReservedQueryDto> {}

export class ExternalCalendarEventsRessourceReservedParamsDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceReservedParamsDto> {
  @Transform(({ value }) => ExternalCalendar.findOrFail(value))
  @AwaitPromise
  public externalCalendar: ExternalCalendar
}

@Exclude()
export class ExternalCalendarEventsRessourceReservedFilesDtoAfter
implements AsSameProperties<ExternalCalendarEventsRessourceReservedFilesDto> {}

@SkipTransform([['files', ExternalCalendarEventsRessourceReservedFilesDtoAfter]])
export class ExternalCalendarEventsRessourceReservedDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarEventsRessourceReservedDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedBodyDtoAfter)
  public body: ExternalCalendarEventsRessourceReservedBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedQueryDtoAfter)
  public query: ExternalCalendarEventsRessourceReservedQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedParamsDtoAfter)
  public params: ExternalCalendarEventsRessourceReservedParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarEventsRessourceReservedFilesDtoAfter)
  public files: ExternalCalendarEventsRessourceReservedFilesDtoAfter
}
