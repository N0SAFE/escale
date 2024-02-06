import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export class UsersRessourcePostBodyDto extends BaseDto {}

export class UsersRessourcePostQueryDto extends BaseDto {}

export class UsersRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostBodyDto)
  private _body: UsersRessourcePostBodyDto = new UsersRessourcePostBodyDto({})

  public get body (): UsersRessourcePostBodyDto {
    return this._body || new UsersRessourcePostBodyDto({})
  }

  public set body (value: UsersRessourcePostBodyDto | undefined) {
    this._body = new UsersRessourcePostBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostQueryDto)
  private _query: UsersRessourcePostQueryDto = new UsersRessourcePostQueryDto({})

  public get query (): UsersRessourcePostQueryDto {
    return this._query || new UsersRessourcePostQueryDto({})
  }

  public set query (value: UsersRessourcePostQueryDto | undefined) {
    this._query = new UsersRessourcePostQueryDto(value || {})
  }
}
