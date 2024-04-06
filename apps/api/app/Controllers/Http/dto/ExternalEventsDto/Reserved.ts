import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { EntityExist } from '../Decorator/EntityExist'

export class ExternalEventsRessourceReservedBodyDto {}

export class ExternalEventsRessourceReservedQueryDto {}

export class ExternalEventsRessourceReservedParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(ExternalCalendar)
  public externalCalendar: number
}

@Exclude()
export class ExternalEventsRessourceReservedFilesDto {}

@SkipTransform([['files', ExternalEventsRessourceReservedFilesDto]])
export class ExternalEventsRessourceReservedDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedBodyDto)
  public body: ExternalEventsRessourceReservedBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedQueryDto)
  public query: ExternalEventsRessourceReservedQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedParamsDto)
  public params: ExternalEventsRessourceReservedParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedFilesDto)
  public files: ExternalEventsRessourceReservedFilesDto

  public get after () {
    return new ExternalEventsRessourceReservedDtoAfter(this)
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

export class ExternalEventsRessourceReservedBodyDtoAfter
implements AsSameProperties<ExternalEventsRessourceReservedBodyDto> {}

export class ExternalEventsRessourceReservedQueryDtoAfter
implements AsSameProperties<ExternalEventsRessourceReservedQueryDto> {}

export class ExternalEventsRessourceReservedParamsDtoAfter
implements AsSameProperties<ExternalEventsRessourceReservedParamsDto> {
  @Transform(({ value }) => ExternalCalendar.findOrFail(value))
  @AwaitPromise
  public externalCalendar: ExternalCalendar
}

@Exclude()
export class ExternalEventsRessourceReservedFilesDtoAfter
implements AsSameProperties<ExternalEventsRessourceReservedFilesDto> {}

@SkipTransform([['files', ExternalEventsRessourceReservedFilesDtoAfter]])
export class ExternalEventsRessourceReservedDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalEventsRessourceReservedDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedBodyDtoAfter)
  public body: ExternalEventsRessourceReservedBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedQueryDtoAfter)
  public query: ExternalEventsRessourceReservedQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedParamsDtoAfter)
  public params: ExternalEventsRessourceReservedParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceReservedFilesDtoAfter)
  public files: ExternalEventsRessourceReservedFilesDtoAfter
}
