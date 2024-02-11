import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ContactRessourceDeleteBodyDto {}

export class ContactRessourceDeleteQueryDto {}

export class ContactRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceDeleteBodyDto)
  public body: ContactRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceDeleteQueryDto)
  public query: ContactRessourceDeleteQueryDto

  public get after () {
    return new ContactRessourceDeleteDtoAfter(this)
  }
}

export class ContactRessourceDeleteBodyDtoAfter
implements AsSameProperties<ContactRessourceDeleteBodyDto> {}

export class ContactRessourceDeleteQueryDtoAfter
implements AsSameProperties<ContactRessourceDeleteQueryDto> {}

export class ContactRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceDeleteBodyDtoAfter)
  public body: ContactRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceDeleteQueryDtoAfter)
  public query: ContactRessourceDeleteQueryDtoAfter
}
