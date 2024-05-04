import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export class UsersRessourcePatchBodyDto extends BaseDto {
  public email?: string
  public password?: string
}

export class UsersRessourcePatchQueryDto extends BaseDto {}

export class UsersRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchBodyDto)
  private _body: UsersRessourcePatchBodyDto = new UsersRessourcePatchBodyDto({})

  public get body (): UsersRessourcePatchBodyDto {
    return this._body || new UsersRessourcePatchBodyDto({})
  }

  public set body (value: UsersRessourcePatchBodyDto | undefined) {
    this._body = new UsersRessourcePatchBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePatchQueryDto)
  private _query: UsersRessourcePatchQueryDto = new UsersRessourcePatchQueryDto({})

  public get query (): UsersRessourcePatchQueryDto {
    return this._query || new UsersRessourcePatchQueryDto({})
  }

  public set query (value: UsersRessourcePatchQueryDto | undefined) {
    this._query = new UsersRessourcePatchQueryDto(value || {})
  }
}
