import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type, instanceToInstance } from 'class-transformer'

export class ReservationsRessourcePutBodyDto extends BaseDto {}

export class ReservationsRessourcePutQueryDto extends BaseDto {}

export class ReservationsRessourcePutDto extends BaseDto {
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
  @Type(() => ReservationsRessourcePutBodyDto)
  private _body: ReservationsRessourcePutBodyDto = {} as ReservationsRessourcePutBodyDto

  public get body (): ReservationsRessourcePutBodyDto {
    return this._body || new ReservationsRessourcePutBodyDto({})
  }

  public set body (value: ReservationsRessourcePutBodyDto | undefined) {
    this._body = new ReservationsRessourcePutBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourcePutQueryDto)
  private _query: ReservationsRessourcePutQueryDto = {} as ReservationsRessourcePutQueryDto

  public get query (): ReservationsRessourcePutQueryDto {
    return this._query || new ReservationsRessourcePutQueryDto({})
  }

  public set query (value: ReservationsRessourcePutQueryDto | undefined) {
    this._query = new ReservationsRessourcePutQueryDto(value || {})
  }
}
