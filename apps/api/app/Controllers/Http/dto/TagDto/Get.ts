import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class TagRessourceGetBodyDto {}

export class TagRessourceGetQueryDto {}

export class TagRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetBodyDto)
  public body: TagRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetQueryDto)
  public query: TagRessourceGetQueryDto

  public get after() {
    return new TagRessourceGetDtoAfter(this)
  }
}

export class TagRessourceGetBodyDtoAfter implements AsSameProperties<TagRessourceGetBodyDto> {}

export class TagRessourceGetQueryDtoAfter implements AsSameProperties<TagRessourceGetQueryDto> {}

export class TagRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetBodyDtoAfter)
  public body: TagRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetQueryDtoAfter)
  public query: TagRessourceGetQueryDtoAfter
}
