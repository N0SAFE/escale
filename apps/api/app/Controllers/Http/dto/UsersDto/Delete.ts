import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import User from 'App/Models/User'
import { EntityExist } from '../Decorator/EntityExist'

export class UsersRessourceDeleteBodyDto {}

export class UsersRessourceDeleteQueryDto {}

export class UsersRessourceDeleteParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(User)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class UsersRessourceDeleteFilesDto {}

@SkipTransform([['files', UsersRessourceDeleteFilesDto]])
export class UsersRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteBodyDto)
  public body: UsersRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteQueryDto)
  public query: UsersRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteParamsDto)
  public params: UsersRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteFilesDto)
  public files: UsersRessourceDeleteFilesDto

  public get after () {
    return new UsersRessourceDeleteDtoAfter(this)
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

export class UsersRessourceDeleteBodyDtoAfter
implements AsSameProperties<UsersRessourceDeleteBodyDto> {}

export class UsersRessourceDeleteQueryDtoAfter
implements AsSameProperties<UsersRessourceDeleteQueryDto> {}

export class UsersRessourceDeleteParamsDtoAfter
implements AsSameProperties<UsersRessourceDeleteParamsDto> {
  @Transform(({ value }) => User.findOrFail(value))
  @AwaitPromise
  public id: User
}

@Exclude()
export class UsersRessourceDeleteFilesDtoAfter
implements AsSameProperties<UsersRessourceDeleteFilesDto> {}

@SkipTransform([['files', UsersRessourceDeleteFilesDtoAfter]])
export class UsersRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UsersRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteBodyDtoAfter)
  public body: UsersRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteQueryDtoAfter)
  public query: UsersRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteParamsDtoAfter)
  public params: UsersRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteFilesDtoAfter)
  public files: UsersRessourceDeleteFilesDtoAfter
}
