import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import User from 'App/Models/User'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class UsersRessourceGetBodyDto {}

export class UsersRessourceGetQueryDto {}

export class UsersRessourceGetParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(User)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class UsersRessourceGetFilesDto {}

@SkipTransform([['files', UsersRessourceGetFilesDto]])
export class UsersRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetBodyDto)
  public body: UsersRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetQueryDto)
  public query: UsersRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetParamsDto)
  public params: UsersRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetFilesDto)
  public files: UsersRessourceGetFilesDto

  public get after() {
    return new UsersRessourceGetDtoAfter(this)
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

export class UsersRessourceGetBodyDtoAfter implements AsSameProperties<UsersRessourceGetBodyDto> {}

export class UsersRessourceGetQueryDtoAfter
  implements AsSameProperties<UsersRessourceGetQueryDto> {}

export class UsersRessourceGetParamsDtoAfter
  implements AsSameProperties<UsersRessourceGetParamsDto>
{
  @Transform(({ value }) => User.findOrFail(value))
  @AwaitPromise
  public id: User
}

@Exclude()
export class UsersRessourceGetFilesDtoAfter
  implements AsSameProperties<UsersRessourceGetFilesDto> {}

@SkipTransform([['files', UsersRessourceGetFilesDtoAfter]])
export class UsersRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UsersRessourceGetDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetBodyDtoAfter)
  public body: UsersRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetQueryDtoAfter)
  public query: UsersRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetParamsDtoAfter)
  public params: UsersRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetFilesDtoAfter)
  public files: UsersRessourceGetFilesDtoAfter
}
