import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export class UsersRessourceDeleteBodyDto extends BaseDto {}

export class UsersRessourceDeleteQueryDto extends BaseDto {}

export class UsersRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteBodyDto)
  private _body: UsersRessourceDeleteBodyDto = new UsersRessourceDeleteBodyDto({})

  public get body (): UsersRessourceDeleteBodyDto {
    return this._body || new UsersRessourceDeleteBodyDto({})
  }

  public set body (value: UsersRessourceDeleteBodyDto | undefined) {
    this._body = new UsersRessourceDeleteBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceDeleteQueryDto)
  private _query: UsersRessourceDeleteQueryDto = new UsersRessourceDeleteQueryDto({})

  public get query (): UsersRessourceDeleteQueryDto {
    return this._query || new UsersRessourceDeleteQueryDto({})
  }

  public set query (value: UsersRessourceDeleteQueryDto | undefined) {
    this._query = new UsersRessourceDeleteQueryDto(value || {})
  }
}
