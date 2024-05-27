import {
  IsEmail,
  Matches,
  IsOptional,
  IsBoolean,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'

export class AuthRegisterBodyDto extends BaseDto {
  @IsDefined()
  @IsEmail()
  public email: string

  @IsDefined()
  @Matches(/.{8,}$/, {
    message: 'password must be at least 8 characters',
  })
  @Matches(/[a-z]/, {
    message: 'password must contain at least one lowercase letter',
  })
  @Matches(/[A-Z]/, {
    message: 'password must contain at least one uppercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'password must contain at least one number',
  })
  @Matches(/[!@#$%^&*]/, {
    message: 'password must contain at least one special character',
  })
  public password: string

  @IsOptional()
  @IsBoolean()
  public rememberMe?: boolean
}

export default class AuthRegisterDto extends BaseDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => AuthRegisterBodyDto)
  private _body: AuthRegisterBodyDto

  public get body (): AuthRegisterBodyDto {
    return this._body
  }

  public set body (value: AuthRegisterBodyDto) {
    this._body = new AuthRegisterBodyDto(value)
  }
}
