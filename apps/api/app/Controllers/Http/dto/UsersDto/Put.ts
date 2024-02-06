import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export class UsersRessourcePutBodyDto extends BaseDto {}

export class UsersRessourcePutQueryDto extends BaseDto {}

export class UsersRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutBodyDto)
  private _body: UsersRessourcePutBodyDto = new UsersRessourcePutBodyDto({})

  public get body (): UsersRessourcePutBodyDto {
    return this._body || new UsersRessourcePutBodyDto({})
  }

  public set body (value: UsersRessourcePutBodyDto | undefined) {
    this._body = new UsersRessourcePutBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePutQueryDto)
  private _query: UsersRessourcePutQueryDto = new UsersRessourcePutQueryDto({})

  public get query (): UsersRessourcePutQueryDto {
    return this._query || new UsersRessourcePutQueryDto({})
  }

  public set query (value: UsersRessourcePutQueryDto | undefined) {
    this._query = new UsersRessourcePutQueryDto(value || {})
  }
}
