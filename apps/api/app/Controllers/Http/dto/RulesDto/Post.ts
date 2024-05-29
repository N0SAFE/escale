import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class RulesRessourcePostBodyDto {}

export class RulesRessourcePostQueryDto {}

export class RulesRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePostBodyDto)
  public body: RulesRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePostQueryDto)
  public query: RulesRessourcePostQueryDto

  public get after() {
    return new RulesRessourcePostDtoAfter(this)
  }
}

export class RulesRessourcePostBodyDtoAfter
  implements AsSameProperties<RulesRessourcePostBodyDto> {}

export class RulesRessourcePostQueryDtoAfter
  implements AsSameProperties<RulesRessourcePostQueryDto> {}

export class RulesRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePostBodyDtoAfter)
  public body: RulesRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePostQueryDtoAfter)
  public query: RulesRessourcePostQueryDtoAfter
}
