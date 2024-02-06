import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export type IsEmail = `${string}@${string}.${string}`

export class AuthLoginBodyDto extends BaseDto {
  @IsEmail()
  public email: IsEmail

  @IsString()
  public password: string

  @IsOptional()
  @IsBoolean()
  public rememberMe?: boolean
}

export default class AuthLoginDto extends BaseDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => AuthLoginBodyDto)
  private _body: AuthLoginBodyDto

  public get body (): AuthLoginBodyDto {
    return this._body
  }

  public set body (value: AuthLoginBodyDto) {
    this._body = new AuthLoginBodyDto(value)
  }
}
