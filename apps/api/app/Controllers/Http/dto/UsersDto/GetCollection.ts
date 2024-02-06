import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export class UsersRessourceGetCollectionBodyDto extends BaseDto {}

export class UsersRessourceGetCollectionQueryDto extends BaseDto {}

export class UsersRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionBodyDto)
  private _body: UsersRessourceGetCollectionBodyDto = new UsersRessourceGetCollectionBodyDto({})

  public get body (): UsersRessourceGetCollectionBodyDto {
    return this._body || new UsersRessourceGetCollectionBodyDto({})
  }

  public set body (value: UsersRessourceGetCollectionBodyDto | undefined) {
    this._body = new UsersRessourceGetCollectionBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionQueryDto)
  private _query: UsersRessourceGetCollectionQueryDto = new UsersRessourceGetCollectionQueryDto({})

  public get query (): UsersRessourceGetCollectionQueryDto {
    return this._query || new UsersRessourceGetCollectionQueryDto({})
  }

  public set query (value: UsersRessourceGetCollectionQueryDto | undefined) {
    this._query = new UsersRessourceGetCollectionQueryDto(value || {})
  }
}
