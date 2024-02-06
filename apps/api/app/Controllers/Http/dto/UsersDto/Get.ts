import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export class UsersRessourceGetBodyDto extends BaseDto {}

export class UsersRessourceGetQueryDto extends BaseDto {}

export class UsersRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetBodyDto)
  private _body: UsersRessourceGetBodyDto = new UsersRessourceGetBodyDto({})

  public get body (): UsersRessourceGetBodyDto {
    return this._body || new UsersRessourceGetBodyDto({})
  }

  public set body (value: UsersRessourceGetBodyDto | undefined) {
    this._body = new UsersRessourceGetBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetQueryDto)
  private _query: UsersRessourceGetQueryDto = new UsersRessourceGetQueryDto({})

  public get query (): UsersRessourceGetQueryDto {
    return this._query || new UsersRessourceGetQueryDto({})
  }

  public set query (value: UsersRessourceGetQueryDto | undefined) {
    this._query = new UsersRessourceGetQueryDto(value || {})
  }
}
