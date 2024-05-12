import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class RolesRessourceGetBodyDto {}

export class RolesRessourceGetQueryDto {}

export class RolesRessourceGetParamsDto {}

@Exclude()
export class RolesRessourceGetFilesDto {}

@SkipTransform([['files', RolesRessourceGetFilesDto]])
export class RolesRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetBodyDto)
  public body: RolesRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetQueryDto)
  public query: RolesRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetParamsDto)
  public params: RolesRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetFilesDto)
  public files: RolesRessourceGetFilesDto

  public get after () {
    return new RolesRessourceGetDtoAfter(this)
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

export class RolesRessourceGetBodyDtoAfter implements AsSameProperties<RolesRessourceGetBodyDto> {}

export class RolesRessourceGetQueryDtoAfter
implements AsSameProperties<RolesRessourceGetQueryDto> {}

export class RolesRessourceGetParamsDtoAfter
implements AsSameProperties<RolesRessourceGetParamsDto> {}

@Exclude()
export class RolesRessourceGetFilesDtoAfter
implements AsSameProperties<RolesRessourceGetFilesDto> {}

@SkipTransform([['files', RolesRessourceGetFilesDtoAfter]])
export class RolesRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<RolesRessourceGetDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetBodyDtoAfter)
  public body: RolesRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetQueryDtoAfter)
  public query: RolesRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetParamsDtoAfter)
  public params: RolesRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetFilesDtoAfter)
  public files: RolesRessourceGetFilesDtoAfter
}
