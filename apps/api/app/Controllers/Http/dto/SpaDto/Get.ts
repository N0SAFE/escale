import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class SpaRessourceGetBodyDto {}

export class SpaRessourceGetQueryDto {}

export class SpaRessourceGetParamsDto {
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  @EntityExist(Spa)
  public id: number
}

@Exclude()
export class SpaRessourceGetFilesDto {}

@SkipTransform([['files', SpaRessourceGetFilesDto]])
export class SpaRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetBodyDto)
  public body: SpaRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetQueryDto)
  public query: SpaRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetParamsDto)
  public params: SpaRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetFilesDto)
  public files: SpaRessourceGetFilesDto

  public get after () {
    return new SpaRessourceGetDtoAfter(this)
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

export class SpaRessourceGetBodyDtoAfter implements AsSameProperties<SpaRessourceGetBodyDto> {}

export class SpaRessourceGetQueryDtoAfter implements AsSameProperties<SpaRessourceGetQueryDto> {}

export class SpaRessourceGetParamsDtoAfter implements AsSameProperties<SpaRessourceGetParamsDto> {
  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public id: Spa
}

@Exclude()
export class SpaRessourceGetFilesDtoAfter implements AsSameProperties<SpaRessourceGetFilesDto> {}

@SkipTransform([['files', SpaRessourceGetFilesDtoAfter]])
export class SpaRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaRessourceGetDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetBodyDtoAfter)
  public body: SpaRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetQueryDtoAfter)
  public query: SpaRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetParamsDtoAfter)
  public params: SpaRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetFilesDtoAfter)
  public files: SpaRessourceGetFilesDtoAfter
}
