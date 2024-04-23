import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class HomeRessourcePutBodyDto {}

export class HomeRessourcePutQueryDto {}

export class HomeRessourcePutParamsDto {}

@Exclude()
export class HomeRessourcePutFilesDto {}

@SkipTransform([['files', HomeRessourcePutFilesDto]])
export class HomeRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutBodyDto)
  public body: HomeRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutQueryDto)
  public query: HomeRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutParamsDto)
  public params: HomeRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutFilesDto)
  public files: HomeRessourcePutFilesDto

  public get after () {
    return new HomeRessourcePutDtoAfter(this)
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

export class HomeRessourcePutBodyDtoAfter implements AsSameProperties<HomeRessourcePutBodyDto> {}

export class HomeRessourcePutQueryDtoAfter implements AsSameProperties<HomeRessourcePutQueryDto> {}

export class HomeRessourcePutParamsDtoAfter
implements AsSameProperties<HomeRessourcePutParamsDto> {}

@Exclude()
export class HomeRessourcePutFilesDtoAfter implements AsSameProperties<HomeRessourcePutFilesDto> {}

@SkipTransform([['files', HomeRessourcePutFilesDtoAfter]])
export class HomeRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<HomeRessourcePutDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutBodyDtoAfter)
  public body: HomeRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutQueryDtoAfter)
  public query: HomeRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutParamsDtoAfter)
  public params: HomeRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => HomeRessourcePutFilesDtoAfter)
  public files: HomeRessourcePutFilesDtoAfter
}
