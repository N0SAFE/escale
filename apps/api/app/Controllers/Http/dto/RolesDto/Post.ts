import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class RolesRessourcePostBodyDto {}

export class RolesRessourcePostQueryDto {}

export class RolesRessourcePostParamsDto {}

@Exclude()
export class RolesRessourcePostFilesDto {}

@SkipTransform([['files', RolesRessourcePostFilesDto]])
export class RolesRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostBodyDto)
  public body: RolesRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostQueryDto)
  public query: RolesRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostParamsDto)
  public params: RolesRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostFilesDto)
  public files: RolesRessourcePostFilesDto

  public get after () {
    return new RolesRessourcePostDtoAfter(this)
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

export class RolesRessourcePostBodyDtoAfter
implements AsSameProperties<RolesRessourcePostBodyDto> {}

export class RolesRessourcePostQueryDtoAfter
implements AsSameProperties<RolesRessourcePostQueryDto> {}

export class RolesRessourcePostParamsDtoAfter
implements AsSameProperties<RolesRessourcePostParamsDto> {}

@Exclude()
export class RolesRessourcePostFilesDtoAfter
implements AsSameProperties<RolesRessourcePostFilesDto> {}

@SkipTransform([['files', RolesRessourcePostFilesDtoAfter]])
export class RolesRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<RolesRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostBodyDtoAfter)
  public body: RolesRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostQueryDtoAfter)
  public query: RolesRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostParamsDtoAfter)
  public params: RolesRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePostFilesDtoAfter)
  public files: RolesRessourcePostFilesDtoAfter
}
