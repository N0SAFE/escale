import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import Spa from 'App/Models/Spa'
import { EntityExist } from '../Decorator/EntityExist'

export class SpaRessourceDeleteBodyDto {}

export class SpaRessourceDeleteQueryDto {}

export class SpaRessourceDeleteParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Spa)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class SpaRessourceDeleteFilesDto {}

@SkipTransform([['files', SpaRessourceDeleteFilesDto]])
export class SpaRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteBodyDto)
  public body: SpaRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteQueryDto)
  public query: SpaRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteParamsDto)
  public params: SpaRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteFilesDto)
  public files: SpaRessourceDeleteFilesDto

  public get after () {
    return new SpaRessourceDeleteDtoAfter(this)
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

export class SpaRessourceDeleteBodyDtoAfter
implements AsSameProperties<SpaRessourceDeleteBodyDto> {}

export class SpaRessourceDeleteQueryDtoAfter
implements AsSameProperties<SpaRessourceDeleteQueryDto> {}

export class SpaRessourceDeleteParamsDtoAfter
implements AsSameProperties<SpaRessourceDeleteParamsDto> {
  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public id: Spa
}

@Exclude()
export class SpaRessourceDeleteFilesDtoAfter
implements AsSameProperties<SpaRessourceDeleteFilesDto> {}

@SkipTransform([['files', SpaRessourceDeleteFilesDtoAfter]])
export class SpaRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteBodyDtoAfter)
  public body: SpaRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteQueryDtoAfter)
  public query: SpaRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteParamsDtoAfter)
  public params: SpaRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteFilesDtoAfter)
  public files: SpaRessourceDeleteFilesDtoAfter
}
