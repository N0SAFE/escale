import { IsDefined, IsEmail, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UsersRessourcePatchBodyDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  public email?: string

  @IsOptional()
  @IsString()
  public password?: string
}

export class UsersRessourcePatchQueryDto {}

export class UsersRessourcePatchParamsDto {}

@Exclude()
export class UsersRessourcePatchFilesDto {}

@SkipTransform([['files', UsersRessourcePatchFilesDto]])
export class UsersRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchBodyDto)
  public body: UsersRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchQueryDto)
  public query: UsersRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchParamsDto)
  public params: UsersRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchFilesDto)
  public files: UsersRessourcePatchFilesDto

  public get after() {
    return new UsersRessourcePatchDtoAfter(this)
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

export class UsersRessourcePatchBodyDtoAfter
  implements AsSameProperties<UsersRessourcePatchBodyDto>
{
  public email?: string
  public password?: string
}

export class UsersRessourcePatchQueryDtoAfter
  implements AsSameProperties<UsersRessourcePatchQueryDto> {}

export class UsersRessourcePatchParamsDtoAfter
  implements AsSameProperties<UsersRessourcePatchParamsDto> {}

@Exclude()
export class UsersRessourcePatchFilesDtoAfter
  implements AsSameProperties<UsersRessourcePatchFilesDto> {}

@SkipTransform([['files', UsersRessourcePatchFilesDtoAfter]])
export class UsersRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UsersRessourcePatchDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchBodyDtoAfter)
  public body: UsersRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchQueryDtoAfter)
  public query: UsersRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchParamsDtoAfter)
  public params: UsersRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchFilesDtoAfter)
  public files: UsersRessourcePatchFilesDtoAfter
}
