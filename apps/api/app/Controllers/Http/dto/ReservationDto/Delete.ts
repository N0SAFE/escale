import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type, instanceToInstance } from 'class-transformer'

export class ReservationsRessourceDeleteBodyDto extends BaseDto {}

export class ReservationsRessourceDeleteQueryDto extends BaseDto {}

export class ReservationsRessourceDeleteDto extends BaseDto {
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
  @Type(() => ReservationsRessourceDeleteBodyDto)
  private _body: ReservationsRessourceDeleteBodyDto = {} as ReservationsRessourceDeleteBodyDto

  public get body (): ReservationsRessourceDeleteBodyDto {
    return this._body || new ReservationsRessourceDeleteBodyDto({})
  }

  public set body (value: ReservationsRessourceDeleteBodyDto | undefined) {
    this._body = new ReservationsRessourceDeleteBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceDeleteQueryDto)
  private _query: ReservationsRessourceDeleteQueryDto = {} as ReservationsRessourceDeleteQueryDto

  public get query (): ReservationsRessourceDeleteQueryDto {
    return this._query || new ReservationsRessourceDeleteQueryDto({})
  }

  public set query (value: ReservationsRessourceDeleteQueryDto | undefined) {
    this._query = new ReservationsRessourceDeleteQueryDto(value || {})
  }
}
