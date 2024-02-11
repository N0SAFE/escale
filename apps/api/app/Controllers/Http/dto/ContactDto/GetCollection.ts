import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ContactRessourceGetCollectionBodyDto {}

export class ContactRessourceGetCollectionQueryDto {}

export class ContactRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetCollectionBodyDto)
  public body: ContactRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetCollectionQueryDto)
  public query: ContactRessourceGetCollectionQueryDto

  public get after () {
    return new ContactRessourceGetCollectionDtoAfter(this)
  }
}

export class ContactRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<ContactRessourceGetCollectionBodyDto> {}

export class ContactRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<ContactRessourceGetCollectionQueryDto> {}

export class ContactRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetCollectionBodyDtoAfter)
  public body: ContactRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactRessourceGetCollectionQueryDtoAfter)
  public query: ContactRessourceGetCollectionQueryDtoAfter
}
