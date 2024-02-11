import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ContactRessourceGetBodyDto {}

export class ContactRessourceGetQueryDto {}

export class ContactRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetBodyDto)
  public body: ContactRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetQueryDto)
  public query: ContactRessourceGetQueryDto

  public get after () {
    return new ContactRessourceGetDtoAfter(this)
  }
}

export class ContactRessourceGetBodyDtoAfter
implements AsSameProperties<ContactRessourceGetBodyDto> {}

export class ContactRessourceGetQueryDtoAfter
implements AsSameProperties<ContactRessourceGetQueryDto> {}

export class ContactRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetBodyDtoAfter)
  public body: ContactRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetQueryDtoAfter)
  public query: ContactRessourceGetQueryDtoAfter
}
