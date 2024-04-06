import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { EntityExist } from '../Decorator/EntityExist'

export class ExternalEventsRessourceBlockedBodyDto {}

export class ExternalEventsRessourceBlockedQueryDto {}

export class ExternalEventsRessourceBlockedParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  @EntityExist(ExternalCalendar)
  public externalCalendar: number
}

@Exclude()
export class ExternalEventsRessourceBlockedFilesDto {}

@SkipTransform([['files', ExternalEventsRessourceBlockedFilesDto]])
export class ExternalEventsRessourceBlockedDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedBodyDto)
  public body: ExternalEventsRessourceBlockedBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedQueryDto)
  public query: ExternalEventsRessourceBlockedQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedParamsDto)
  public params: ExternalEventsRessourceBlockedParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedFilesDto)
  public files: ExternalEventsRessourceBlockedFilesDto

  public get after () {
    return new ExternalEventsRessourceBlockedDtoAfter(this)
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

export class ExternalEventsRessourceBlockedBodyDtoAfter
implements AsSameProperties<ExternalEventsRessourceBlockedBodyDto> {}

export class ExternalEventsRessourceBlockedQueryDtoAfter
implements AsSameProperties<ExternalEventsRessourceBlockedQueryDto> {}

export class ExternalEventsRessourceBlockedParamsDtoAfter
implements AsSameProperties<ExternalEventsRessourceBlockedParamsDto> {
  @Transform(({ value }) => ExternalCalendar.findOrFail(value))
  @AwaitPromise
  public externalCalendar: ExternalCalendar
}

@Exclude()
export class ExternalEventsRessourceBlockedFilesDtoAfter
implements AsSameProperties<ExternalEventsRessourceBlockedFilesDto> {}

@SkipTransform([['files', ExternalEventsRessourceBlockedFilesDtoAfter]])
export class ExternalEventsRessourceBlockedDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalEventsRessourceBlockedDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedBodyDtoAfter)
  public body: ExternalEventsRessourceBlockedBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedQueryDtoAfter)
  public query: ExternalEventsRessourceBlockedQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedParamsDtoAfter)
  public params: ExternalEventsRessourceBlockedParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalEventsRessourceBlockedFilesDtoAfter)
  public files: ExternalEventsRessourceBlockedFilesDtoAfter
}
