import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class HomeRessourceGetBodyDto {}

export class HomeRessourceGetQueryDto {}

export class HomeRessourceGetParamsDto {}

@Exclude()
export class HomeRessourceGetFilesDto {}

@SkipTransform([['files', HomeRessourceGetFilesDto]])
export class HomeRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetBodyDto)
  public body: HomeRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetQueryDto)
  public query: HomeRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetParamsDto)
  public params: HomeRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetFilesDto)
  public files: HomeRessourceGetFilesDto

  public get after () {
    return new HomeRessourceGetDtoAfter(this)
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

export class HomeRessourceGetBodyDtoAfter implements AsSameProperties<HomeRessourceGetBodyDto> {}

export class HomeRessourceGetQueryDtoAfter implements AsSameProperties<HomeRessourceGetQueryDto> {}

export class HomeRessourceGetParamsDtoAfter
implements AsSameProperties<HomeRessourceGetParamsDto> {}

@Exclude()
export class HomeRessourceGetFilesDtoAfter implements AsSameProperties<HomeRessourceGetFilesDto> {}

@SkipTransform([['files', HomeRessourceGetFilesDtoAfter]])
export class HomeRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<HomeRessourceGetDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetBodyDtoAfter)
  public body: HomeRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetQueryDtoAfter)
  public query: HomeRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetParamsDtoAfter)
  public params: HomeRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourceGetFilesDtoAfter)
  public files: HomeRessourceGetFilesDtoAfter
}
