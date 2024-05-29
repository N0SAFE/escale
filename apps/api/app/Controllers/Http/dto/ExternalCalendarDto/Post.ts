import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class ExternalCalendarRessourcePostBodyDto {}

export class ExternalCalendarRessourcePostQueryDto {}

export class ExternalCalendarRessourcePostParamsDto {}

@Exclude()
export class ExternalCalendarRessourcePostFilesDto {}

@SkipTransform([['files', ExternalCalendarRessourcePostFilesDto]])
export class ExternalCalendarRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostBodyDto)
  public body: ExternalCalendarRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostQueryDto)
  public query: ExternalCalendarRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostParamsDto)
  public params: ExternalCalendarRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostFilesDto)
  public files: ExternalCalendarRessourcePostFilesDto

  public get after() {
    return new ExternalCalendarRessourcePostDtoAfter(this)
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

export class ExternalCalendarRessourcePostBodyDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePostBodyDto> {}

export class ExternalCalendarRessourcePostQueryDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePostQueryDto> {}

export class ExternalCalendarRessourcePostParamsDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePostParamsDto> {}

@Exclude()
export class ExternalCalendarRessourcePostFilesDtoAfter
  implements AsSameProperties<ExternalCalendarRessourcePostFilesDto> {}

@SkipTransform([['files', ExternalCalendarRessourcePostFilesDtoAfter]])
export class ExternalCalendarRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ExternalCalendarRessourcePostDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostBodyDtoAfter)
  public body: ExternalCalendarRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostQueryDtoAfter)
  public query: ExternalCalendarRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostParamsDtoAfter)
  public params: ExternalCalendarRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalCalendarRessourcePostFilesDtoAfter)
  public files: ExternalCalendarRessourcePostFilesDtoAfter
}
