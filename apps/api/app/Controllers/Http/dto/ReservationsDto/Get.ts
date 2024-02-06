import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type, instanceToInstance } from 'class-transformer'

export class ReservationsRessourceGetBodyDto extends BaseDto {}

export class ReservationsRessourceGetQueryDto extends BaseDto {}

export class ReservationsRessourceGetDto extends BaseDto {
  constructor (args: any) {
    super(args)
    if (!args) {
      return
    }
    this.body = args.body
    this.query = args.query
    return instanceToInstance(this)
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceGetBodyDto)
  private _body: ReservationsRessourceGetBodyDto = {} as ReservationsRessourceGetBodyDto

  public get body (): ReservationsRessourceGetBodyDto {
    return this._body || new ReservationsRessourceGetBodyDto({})
  }

  public set body (value: ReservationsRessourceGetBodyDto | undefined) {
    this._body = new ReservationsRessourceGetBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceGetQueryDto)
  private _query: ReservationsRessourceGetQueryDto = {} as ReservationsRessourceGetQueryDto

  public get query (): ReservationsRessourceGetQueryDto {
    return this._query || new ReservationsRessourceGetQueryDto({})
  }

  public set query (value: ReservationsRessourceGetQueryDto | undefined) {
    this._query = new ReservationsRessourceGetQueryDto(value || {})
  }
}
