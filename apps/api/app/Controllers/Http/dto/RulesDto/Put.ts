import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class RulesRessourcePutBodyDto {}

export class RulesRessourcePutQueryDto {}

export class RulesRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePutBodyDto)
  public body: RulesRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePutQueryDto)
  public query: RulesRessourcePutQueryDto

  public get after() {
    return new RulesRessourcePutDtoAfter(this)
  }
}

export class RulesRessourcePutBodyDtoAfter implements AsSameProperties<RulesRessourcePutBodyDto> {}

export class RulesRessourcePutQueryDtoAfter
  implements AsSameProperties<RulesRessourcePutQueryDto> {}

export class RulesRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePutBodyDtoAfter)
  public body: RulesRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePutQueryDtoAfter)
  public query: RulesRessourcePutQueryDtoAfter
}
