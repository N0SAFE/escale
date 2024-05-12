import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import Spa from 'App/Models/Spa'
import { EntityExist } from '../Decorator/EntityExist'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class SpaRessourceRestoreBodyDto {}

export class SpaRessourceRestoreQueryDto {}

export class SpaRessourceRestoreParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Spa)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class SpaRessourceRestoreFilesDto {}

@SkipTransform([['files', SpaRessourceRestoreFilesDto]])
export class SpaRessourceRestoreDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreBodyDto)
  public body: SpaRessourceRestoreBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreQueryDto)
  public query: SpaRessourceRestoreQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreParamsDto)
  public params: SpaRessourceRestoreParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreFilesDto)
  public files: SpaRessourceRestoreFilesDto

  public get after () {
    return new SpaRessourceRestoreDtoAfter(this)
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

export class SpaRessourceRestoreBodyDtoAfter
implements AsSameProperties<SpaRessourceRestoreBodyDto> {}

export class SpaRessourceRestoreQueryDtoAfter
implements AsSameProperties<SpaRessourceRestoreQueryDto> {}

export class SpaRessourceRestoreParamsDtoAfter
implements AsSameProperties<SpaRessourceRestoreParamsDto> {
  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public id: Spa
}

@Exclude()
export class SpaRessourceRestoreFilesDtoAfter
implements AsSameProperties<SpaRessourceRestoreFilesDto> {}

@SkipTransform([['files', SpaRessourceRestoreFilesDtoAfter]])
export class SpaRessourceRestoreDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaRessourceRestoreDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreBodyDtoAfter)
  public body: SpaRessourceRestoreBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreQueryDtoAfter)
  public query: SpaRessourceRestoreQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreParamsDtoAfter)
  public params: SpaRessourceRestoreParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceRestoreFilesDtoAfter)
  public files: SpaRessourceRestoreFilesDtoAfter
}
