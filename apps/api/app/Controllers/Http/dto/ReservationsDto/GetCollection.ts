import {
  IsArray,
  IsDateString,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type, instanceToInstance } from 'class-transformer'
import { EntityExist } from '../Decorator/EntityExist'
import Reservation from 'App/Models/Reservation'
import { PropertyExist } from '../Decorator/PropertyExist'

export class ReservationsRessourceGetCollectionBodyDto extends BaseDto {}

export class ReservationsRessourceGetCollectionQueryDto extends BaseDto {
  @IsDateString()
  @IsOptional()
  @PropertyExist('endAt')
  public startAt?: string

  @IsDateString()
  @IsOptional()
  @PropertyExist('startAt')
  public endAt?: string

  @IsArray()
  @IsOptional()
  @EntityExist(Reservation)
  public ids?: number[]

  @IsNumber()
  @IsOptional()
  public page?: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public limit?: number
}

export class ReservationsRessourceGetCollectionDto extends BaseDto {
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
  @Type(() => ReservationsRessourceGetCollectionBodyDto)
  private _body: ReservationsRessourceGetCollectionBodyDto =
      {} as ReservationsRessourceGetCollectionBodyDto
  public get body (): ReservationsRessourceGetCollectionBodyDto {
    return this._body || new ReservationsRessourceGetCollectionBodyDto({})
  }

  public set body (value: ReservationsRessourceGetCollectionBodyDto | undefined) {
    this._body = new ReservationsRessourceGetCollectionBodyDto(value || {})
  }

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ReservationsRessourceGetCollectionQueryDto)
  private _query: ReservationsRessourceGetCollectionQueryDto =
      {} as ReservationsRessourceGetCollectionQueryDto

  public get query (): ReservationsRessourceGetCollectionQueryDto {
    return this._query || new ReservationsRessourceGetCollectionQueryDto({})
  }

  public set query (value: ReservationsRessourceGetCollectionQueryDto | undefined) {
    this._query = new ReservationsRessourceGetCollectionQueryDto(value || {})
  }
}
