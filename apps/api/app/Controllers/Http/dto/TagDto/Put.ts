import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class TagRessourcePutBodyDto {}

export class TagRessourcePutQueryDto {}

export class TagRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePutBodyDto)
  public body: TagRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePutQueryDto)
  public query: TagRessourcePutQueryDto

  public get after() {
    return new TagRessourcePutDtoAfter(this)
  }
}

export class TagRessourcePutBodyDtoAfter implements AsSameProperties<TagRessourcePutBodyDto> {}

export class TagRessourcePutQueryDtoAfter implements AsSameProperties<TagRessourcePutQueryDto> {}

export class TagRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePutBodyDtoAfter)
  public body: TagRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePutQueryDtoAfter)
  public query: TagRessourcePutQueryDtoAfter
}
