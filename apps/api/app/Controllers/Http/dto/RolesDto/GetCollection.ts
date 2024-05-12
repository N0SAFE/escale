import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class RolesRessourceGetCollectionBodyDto {}

export class RolesRessourceGetCollectionQueryDto {}

export class RolesRessourceGetCollectionParamsDto {}

@Exclude()
export class RolesRessourceGetCollectionFilesDto {}

@SkipTransform([['files', RolesRessourceGetCollectionFilesDto]])
export class RolesRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionBodyDto)
  public body: RolesRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionQueryDto)
  public query: RolesRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionParamsDto)
  public params: RolesRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionFilesDto)
  public files: RolesRessourceGetCollectionFilesDto

  public get after () {
    return new RolesRessourceGetCollectionDtoAfter(this)
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

export class RolesRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<RolesRessourceGetCollectionBodyDto> {}

export class RolesRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<RolesRessourceGetCollectionQueryDto> {}

export class RolesRessourceGetCollectionParamsDtoAfter
implements AsSameProperties<RolesRessourceGetCollectionParamsDto> {}

@Exclude()
export class RolesRessourceGetCollectionFilesDtoAfter
implements AsSameProperties<RolesRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', RolesRessourceGetCollectionFilesDtoAfter]])
export class RolesRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<RolesRessourceGetCollectionDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionBodyDtoAfter)
  public body: RolesRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionQueryDtoAfter)
  public query: RolesRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionParamsDtoAfter)
  public params: RolesRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RolesRessourceGetCollectionFilesDtoAfter)
  public files: RolesRessourceGetCollectionFilesDtoAfter
}
