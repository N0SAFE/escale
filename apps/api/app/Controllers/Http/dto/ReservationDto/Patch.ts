import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type, instanceToInstance } from 'class-transformer'

export class ReservationsRessourcePatchBodyDto extends BaseDto {}

export class ReservationsRessourcePatchQueryDto extends BaseDto {}

export class ReservationsRessourcePatchDto extends BaseDto {
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
  @Type(() => ReservationsRessourcePatchBodyDto)
  private _body: ReservationsRessourcePatchBodyDto = {} as ReservationsRessourcePatchBodyDto

  public get body (): ReservationsRessourcePatchBodyDto {
    return this._body || new ReservationsRessourcePatchBodyDto({})
  }

  public set body (value: ReservationsRessourcePatchBodyDto | undefined) {
    this._body = new ReservationsRessourcePatchBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourcePatchQueryDto)
  private _query: ReservationsRessourcePatchQueryDto = {} as ReservationsRessourcePatchQueryDto

  public get query (): ReservationsRessourcePatchQueryDto {
    return this._query || new ReservationsRessourcePatchQueryDto({})
  }

  public set query (value: ReservationsRessourcePatchQueryDto | undefined) {
    this._query = new ReservationsRessourcePatchQueryDto(value || {})
  }
}
