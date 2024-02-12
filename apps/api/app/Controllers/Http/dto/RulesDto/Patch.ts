import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class RulesRessourcePatchBodyDto {}

export class RulesRessourcePatchQueryDto {}

export class RulesRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePatchBodyDto)
  public body: RulesRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePatchQueryDto)
  public query: RulesRessourcePatchQueryDto

  public get after () {
    return new RulesRessourcePatchDtoAfter(this)
  }
}

export class RulesRessourcePatchBodyDtoAfter
implements AsSameProperties<RulesRessourcePatchBodyDto> {}

export class RulesRessourcePatchQueryDtoAfter
implements AsSameProperties<RulesRessourcePatchQueryDto> {}

export class RulesRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePatchBodyDtoAfter)
  public body: RulesRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RulesRessourcePatchQueryDtoAfter)
  public query: RulesRessourcePatchQueryDtoAfter
}
