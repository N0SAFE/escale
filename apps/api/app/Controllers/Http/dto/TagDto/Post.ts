import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class TagRessourcePostBodyDto {}

export class TagRessourcePostQueryDto {}

export class TagRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePostBodyDto)
  public body: TagRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePostQueryDto)
  public query: TagRessourcePostQueryDto

  public get after() {
    return new TagRessourcePostDtoAfter(this)
  }
}

export class TagRessourcePostBodyDtoAfter implements AsSameProperties<TagRessourcePostBodyDto> {}

export class TagRessourcePostQueryDtoAfter implements AsSameProperties<TagRessourcePostQueryDto> {}

export class TagRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePostBodyDtoAfter)
  public body: TagRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourcePostQueryDtoAfter)
  public query: TagRessourcePostQueryDtoAfter
}
