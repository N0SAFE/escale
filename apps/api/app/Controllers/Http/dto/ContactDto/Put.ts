import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ContactRessourcePutBodyDto {}

export class ContactRessourcePutQueryDto {}

export class ContactRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePutBodyDto)
  public body: ContactRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePutQueryDto)
  public query: ContactRessourcePutQueryDto

  public get after () {
    return new ContactRessourcePutDtoAfter(this)
  }
}

export class ContactRessourcePutBodyDtoAfter
implements AsSameProperties<ContactRessourcePutBodyDto> {}

export class ContactRessourcePutQueryDtoAfter
implements AsSameProperties<ContactRessourcePutQueryDto> {}

export class ContactRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePutBodyDtoAfter)
  public body: ContactRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePutQueryDtoAfter)
  public query: ContactRessourcePutQueryDtoAfter
}
