import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UsersRessourcePutBodyDto {}

export class UsersRessourcePutQueryDto {}

export class UsersRessourcePutParamsDto {}

@Exclude()
export class UsersRessourcePutFilesDto {}

@SkipTransform([['files', UsersRessourcePutFilesDto]])
export class UsersRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutBodyDto)
  public body: UsersRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutQueryDto)
  public query: UsersRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutParamsDto)
  public params: UsersRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutFilesDto)
  public files: UsersRessourcePutFilesDto

  public get after () {
    return new UsersRessourcePutDtoAfter(this)
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

export class UsersRessourcePutBodyDtoAfter implements AsSameProperties<UsersRessourcePutBodyDto> {}

export class UsersRessourcePutQueryDtoAfter
implements AsSameProperties<UsersRessourcePutQueryDto> {}

export class UsersRessourcePutParamsDtoAfter
implements AsSameProperties<UsersRessourcePutParamsDto> {}

@Exclude()
export class UsersRessourcePutFilesDtoAfter
implements AsSameProperties<UsersRessourcePutFilesDto> {}

@SkipTransform([['files', UsersRessourcePutFilesDtoAfter]])
export class UsersRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UsersRessourcePutDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutBodyDtoAfter)
  public body: UsersRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutQueryDtoAfter)
  public query: UsersRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutParamsDtoAfter)
  public params: UsersRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutFilesDtoAfter)
  public files: UsersRessourcePutFilesDtoAfter
}
