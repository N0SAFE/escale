import {
  IsDateString,
  // IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type, instanceToInstance } from 'class-transformer'
import { EntityExist } from '../Decorator/EntityExist'
import User from 'App/Models/User'

export class ReservationsRessourcePostBodyDto extends BaseDto {
  constructor (args) {
    super(args)
  }

  @IsNumber()
  @IsNotEmpty()
  @EntityExist(User)
  public userId: number

  @IsDateString()
  @IsNotEmpty()
  public startAt: string

  @IsDateString()
  @IsNotEmpty()
  public endAt: string
}

export class ReservationsRessourcePostQueryDto extends BaseDto {}

export class ReservationsRessourcePostDto extends BaseDto {
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
  @Type(() => ReservationsRessourcePostBodyDto)
  private _body: ReservationsRessourcePostBodyDto = {} as ReservationsRessourcePostBodyDto

  public get body (): ReservationsRessourcePostBodyDto {
    return this._body || new ReservationsRessourcePostBodyDto({})
  }

  public set body (value: ReservationsRessourcePostBodyDto | undefined) {
    this._body = new ReservationsRessourcePostBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourcePostQueryDto)
  private _query: ReservationsRessourcePostQueryDto = {} as ReservationsRessourcePostQueryDto

  public get query (): ReservationsRessourcePostQueryDto {
    return this._query || new ReservationsRessourcePostQueryDto({})
  }

  public set query (value: ReservationsRessourcePostQueryDto | undefined) {
    this._query = new ReservationsRessourcePostQueryDto(value || {})
  }
}
