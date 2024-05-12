import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class RolesRessourcePatchBodyDto {}

export class RolesRessourcePatchQueryDto {}

export class RolesRessourcePatchParamsDto {}

@Exclude()
export class RolesRessourcePatchFilesDto {}

@SkipTransform([['files', RolesRessourcePatchFilesDto]])
export class RolesRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchBodyDto)
  public body: RolesRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchQueryDto)
  public query: RolesRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchParamsDto)
  public params: RolesRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchFilesDto)
  public files: RolesRessourcePatchFilesDto

  public get after () {
    return new RolesRessourcePatchDtoAfter(this)
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

export class RolesRessourcePatchBodyDtoAfter
implements AsSameProperties<RolesRessourcePatchBodyDto> {}

export class RolesRessourcePatchQueryDtoAfter
implements AsSameProperties<RolesRessourcePatchQueryDto> {}

export class RolesRessourcePatchParamsDtoAfter
implements AsSameProperties<RolesRessourcePatchParamsDto> {}

@Exclude()
export class RolesRessourcePatchFilesDtoAfter
implements AsSameProperties<RolesRessourcePatchFilesDto> {}

@SkipTransform([['files', RolesRessourcePatchFilesDtoAfter]])
export class RolesRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<RolesRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchBodyDtoAfter)
  public body: RolesRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchQueryDtoAfter)
  public query: RolesRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchParamsDtoAfter)
  public params: RolesRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePatchFilesDtoAfter)
  public files: RolesRessourcePatchFilesDtoAfter
}
