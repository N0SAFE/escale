import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class TagRessourceGetCollectionBodyDto {}

export class TagRessourceGetCollectionQueryDto {}

export class TagRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetCollectionBodyDto)
  public body: TagRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetCollectionQueryDto)
  public query: TagRessourceGetCollectionQueryDto

  public get after() {
    return new TagRessourceGetCollectionDtoAfter(this)
  }
}

export class TagRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<TagRessourceGetCollectionBodyDto> {}

export class TagRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<TagRessourceGetCollectionQueryDto> {}

export class TagRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetCollectionBodyDtoAfter)
  public body: TagRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TagRessourceGetCollectionQueryDtoAfter)
  public query: TagRessourceGetCollectionQueryDtoAfter
}
