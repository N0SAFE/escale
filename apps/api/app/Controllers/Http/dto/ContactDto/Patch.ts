import {
  IsDefined,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ContactRessourcePatchBodyDto {}

export class ContactRessourcePatchQueryDto {}

export class ContactRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePatchBodyDto)
  public body: ContactRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePatchQueryDto)
  public query: ContactRessourcePatchQueryDto

  public get after () {
    return new ContactRessourcePatchDtoAfter(this)
  }
}

export class ContactRessourcePatchBodyDtoAfter implements AsSameProperties<ContactRessourcePatchBodyDto> {}

export class ContactRessourcePatchQueryDtoAfter implements AsSameProperties<ContactRessourcePatchQueryDto> {}

export class ContactRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePatchBodyDtoAfter)
  public body: ContactRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePatchQueryDtoAfter)
  public query: ContactRessourcePatchQueryDtoAfter
}
