import { IsDefined, IsEmail, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ContactRessourcePostBodyDto {
  @IsDefined()
  public name: string

  @IsDefined()
  @IsEmail()
  public email: string

  @IsDefined()
  public subject: string

  @IsDefined()
  public message: string
}

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

  public get after() {
    return new ContactRessourcePostDtoAfter(this)
  }
}

export class ContactRessourcePostBodyDtoAfter
  implements AsSameProperties<ContactRessourcePostBodyDto>
{
  public name: string
  public email: string
  public subject: string
  public message: string
}

export class ContactRessourcePostQueryDtoAfter
  implements AsSameProperties<ContactRessourcePostQueryDto> {}

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
