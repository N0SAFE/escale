import {
  IsDefined,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FaqRessourceDeleteBodyDto {}

export class FaqRessourceDeleteQueryDto {}

export class FaqRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteBodyDto)
  public body: FaqRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteQueryDto)
  public query: FaqRessourceDeleteQueryDto

  public get after () {
    return new FaqRessourceDeleteDtoAfter(this)
  }
}

export class FaqRessourceDeleteBodyDtoAfter implements AsSameProperties<FaqRessourceDeleteBodyDto> {}

export class FaqRessourceDeleteQueryDtoAfter implements AsSameProperties<FaqRessourceDeleteQueryDto> {}

export class FaqRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteBodyDtoAfter)
  public body: FaqRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteQueryDtoAfter)
  public query: FaqRessourceDeleteQueryDtoAfter
}
