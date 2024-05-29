import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class ExternalCalendarRessourceGetBodyDto {}

export class ExternalCalendarRessourceGetQueryDto {}

export class ExternalCalendarRessourceGetParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  public id: number
}

@Exclude()
export class ExternalCalendarRessourceGetFilesDto {}

@SkipTransform([['files', ExternalCalendarRessourceGetFilesDto]])
export class ExternalCalendarRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetBodyDto)
  public body: ExternalCalendarRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetQueryDto)
  public query: ExternalCalendarRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetParamsDto)
  public params: ExternalCalendarRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetFilesDto)
  public files: ExternalCalendarRessourceGetFilesDto

  public get after() {
    return new ExternalCalendarRessourceGetDtoAfter(this)
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

export class ExternalCalendarRessourceGetBodyDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetBodyDto> {}

export class ExternalCalendarRessourceGetQueryDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetQueryDto> {}

export class ExternalCalendarRessourceGetParamsDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetParamsDto>
{
  @Transform(({ value }) => ExternalCalendar.findOrFail(value))
  @AwaitPromise
  public id: ExternalCalendar
}

@Exclude()
export class ExternalCalendarRessourceGetFilesDtoAfter
  implements AsSameProperties<ExternalCalendarRessourceGetFilesDto> {}

@SkipTransform([['files', ExternalCalendarRessourceGetFilesDtoAfter]])
export class ExternalCalendarRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarRessourceGetDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetBodyDtoAfter)
  public body: ExternalCalendarRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetQueryDtoAfter)
  public query: ExternalCalendarRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetParamsDtoAfter)
  public params: ExternalCalendarRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourceGetFilesDtoAfter)
  public files: ExternalCalendarRessourceGetFilesDtoAfter
}
