import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class TagRessourceDeleteBodyDto {}

export class TagRessourceDeleteQueryDto {}

export class TagRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceDeleteBodyDto)
  public body: TagRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceDeleteQueryDto)
  public query: TagRessourceDeleteQueryDto

  public get after() {
    return new TagRessourceDeleteDtoAfter(this)
  }
}

export class TagRessourceDeleteBodyDtoAfter
  implements AsSameProperties<TagRessourceDeleteBodyDto> {}

export class TagRessourceDeleteQueryDtoAfter
  implements AsSameProperties<TagRessourceDeleteQueryDto> {}

export class TagRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceDeleteBodyDtoAfter)
  public body: TagRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceDeleteQueryDtoAfter)
  public query: TagRessourceDeleteQueryDtoAfter
}
