import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class RolesRessourcePutBodyDto {}

export class RolesRessourcePutQueryDto {}

export class RolesRessourcePutParamsDto {}

@Exclude()
export class RolesRessourcePutFilesDto {}

@SkipTransform([['files', RolesRessourcePutFilesDto]])
export class RolesRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutBodyDto)
  public body: RolesRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutQueryDto)
  public query: RolesRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutParamsDto)
  public params: RolesRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutFilesDto)
  public files: RolesRessourcePutFilesDto

  public get after() {
    return new RolesRessourcePutDtoAfter(this)
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

export class RolesRessourcePutBodyDtoAfter implements AsSameProperties<RolesRessourcePutBodyDto> {}

export class RolesRessourcePutQueryDtoAfter
  implements AsSameProperties<RolesRessourcePutQueryDto> {}

export class RolesRessourcePutParamsDtoAfter
  implements AsSameProperties<RolesRessourcePutParamsDto> {}

@Exclude()
export class RolesRessourcePutFilesDtoAfter
  implements AsSameProperties<RolesRessourcePutFilesDto> {}

@SkipTransform([['files', RolesRessourcePutFilesDtoAfter]])
export class RolesRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<RolesRessourcePutDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutBodyDtoAfter)
  public body: RolesRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutQueryDtoAfter)
  public query: RolesRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutParamsDtoAfter)
  public params: RolesRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourcePutFilesDtoAfter)
  public files: RolesRessourcePutFilesDtoAfter
}
