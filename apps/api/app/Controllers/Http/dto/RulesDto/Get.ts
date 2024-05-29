import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class RulesRessourceGetBodyDto {}

export class RulesRessourceGetQueryDto {}

export class RulesRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetBodyDto)
  public body: RulesRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetQueryDto)
  public query: RulesRessourceGetQueryDto

  public get after() {
    return new RulesRessourceGetDtoAfter(this)
  }
}

export class RulesRessourceGetBodyDtoAfter implements AsSameProperties<RulesRessourceGetBodyDto> {}

export class RulesRessourceGetQueryDtoAfter
  implements AsSameProperties<RulesRessourceGetQueryDto> {}

export class RulesRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetBodyDtoAfter)
  public body: RulesRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceGetQueryDtoAfter)
  public query: RulesRessourceGetQueryDtoAfter
}
