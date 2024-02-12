import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class RulesRessourceDeleteBodyDto {}

export class RulesRessourceDeleteQueryDto {}

export class RulesRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceDeleteBodyDto)
  public body: RulesRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceDeleteQueryDto)
  public query: RulesRessourceDeleteQueryDto

  public get after () {
    return new RulesRessourceDeleteDtoAfter(this)
  }
}

export class RulesRessourceDeleteBodyDtoAfter
implements AsSameProperties<RulesRessourceDeleteBodyDto> {}

export class RulesRessourceDeleteQueryDtoAfter
implements AsSameProperties<RulesRessourceDeleteQueryDto> {}

export class RulesRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceDeleteBodyDtoAfter)
  public body: RulesRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourceDeleteQueryDtoAfter)
  public query: RulesRessourceDeleteQueryDtoAfter
}
