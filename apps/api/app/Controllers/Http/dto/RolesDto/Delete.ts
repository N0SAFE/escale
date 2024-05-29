import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class RolesRessourceDeleteBodyDto {}

export class RolesRessourceDeleteQueryDto {}

export class RolesRessourceDeleteParamsDto {}

@Exclude()
export class RolesRessourceDeleteFilesDto {}

@SkipTransform([['files', RolesRessourceDeleteFilesDto]])
export class RolesRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteBodyDto)
  public body: RolesRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteQueryDto)
  public query: RolesRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteParamsDto)
  public params: RolesRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteFilesDto)
  public files: RolesRessourceDeleteFilesDto

  public get after() {
    return new RolesRessourceDeleteDtoAfter(this)
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

export class RolesRessourceDeleteBodyDtoAfter
  implements AsSameProperties<RolesRessourceDeleteBodyDto> {}

export class RolesRessourceDeleteQueryDtoAfter
  implements AsSameProperties<RolesRessourceDeleteQueryDto> {}

export class RolesRessourceDeleteParamsDtoAfter
  implements AsSameProperties<RolesRessourceDeleteParamsDto> {}

@Exclude()
export class RolesRessourceDeleteFilesDtoAfter
  implements AsSameProperties<RolesRessourceDeleteFilesDto> {}

@SkipTransform([['files', RolesRessourceDeleteFilesDtoAfter]])
export class RolesRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<RolesRessourceDeleteDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteBodyDtoAfter)
  public body: RolesRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteQueryDtoAfter)
  public query: RolesRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteParamsDtoAfter)
  public params: RolesRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceDeleteFilesDtoAfter)
  public files: RolesRessourceDeleteFilesDtoAfter
}
