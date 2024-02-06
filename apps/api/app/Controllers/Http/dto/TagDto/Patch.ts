import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class TagRessourcePatchBodyDto {}

export class TagRessourcePatchQueryDto {}

export class TagRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePatchBodyDto)
  public body: TagRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePatchQueryDto)
  public query: TagRessourcePatchQueryDto

  public get after () {
    return new TagRessourcePatchDtoAfter(this)
  }
}

export class TagRessourcePatchBodyDtoAfter implements AsSameProperties<TagRessourcePatchBodyDto> {}

export class TagRessourcePatchQueryDtoAfter
implements AsSameProperties<TagRessourcePatchQueryDto> {}

export class TagRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePatchBodyDtoAfter)
  public body: TagRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePatchQueryDtoAfter)
  public query: TagRessourcePatchQueryDtoAfter
}
