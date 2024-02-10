import {
  IsDefined,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ContactRessourcePostBodyDto {}

export class ContactRessourcePostQueryDto {}

export class ContactRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePostBodyDto)
  public body: ContactRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePostQueryDto)
  public query: ContactRessourcePostQueryDto

  public get after () {
    return new ContactRessourcePostDtoAfter(this)
  }
}

export class ContactRessourcePostBodyDtoAfter implements AsSameProperties<ContactRessourcePostBodyDto> {}

export class ContactRessourcePostQueryDtoAfter implements AsSameProperties<ContactRessourcePostQueryDto> {}

export class ContactRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePostBodyDtoAfter)
  public body: ContactRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourcePostQueryDtoAfter)
  public query: ContactRessourcePostQueryDtoAfter
}
