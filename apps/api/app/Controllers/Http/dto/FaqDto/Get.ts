import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FaqRessourceGetBodyDto {}

export class FaqRessourceGetQueryDto {}

export class FaqRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetBodyDto)
  public body: FaqRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetQueryDto)
  public query: FaqRessourceGetQueryDto

  public get after () {
    return new FaqRessourceGetDtoAfter(this)
  }
}

export class FaqRessourceGetBodyDtoAfter implements AsSameProperties<FaqRessourceGetBodyDto> {}

export class FaqRessourceGetQueryDtoAfter implements AsSameProperties<FaqRessourceGetQueryDto> {}

export class FaqRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetBodyDtoAfter)
  public body: FaqRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetQueryDtoAfter)
  public query: FaqRessourceGetQueryDtoAfter
}
