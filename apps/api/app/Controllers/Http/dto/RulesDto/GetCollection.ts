import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class RulesRessourceGetCollectionBodyDto {}

export class RulesRessourceGetCollectionQueryDto {}

export class RulesRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetCollectionBodyDto)
  public body: RulesRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetCollectionQueryDto)
  public query: RulesRessourceGetCollectionQueryDto

  public get after() {
    return new RulesRessourceGetCollectionDtoAfter(this)
  }
}

export class RulesRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<RulesRessourceGetCollectionBodyDto> {}

export class RulesRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<RulesRessourceGetCollectionQueryDto> {}

export class RulesRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetCollectionBodyDtoAfter)
  public body: RulesRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetCollectionQueryDtoAfter)
  public query: RulesRessourceGetCollectionQueryDtoAfter
}
