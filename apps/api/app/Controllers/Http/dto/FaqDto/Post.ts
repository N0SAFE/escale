import {
  IsDefined,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FaqRessourcePostBodyDto {}

export class FaqRessourcePostQueryDto {}

export class FaqRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostBodyDto)
  public body: FaqRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostQueryDto)
  public query: FaqRessourcePostQueryDto

  public get after () {
    return new FaqRessourcePostDtoAfter(this)
  }
}

export class FaqRessourcePostBodyDtoAfter implements AsSameProperties<FaqRessourcePostBodyDto> {}

export class FaqRessourcePostQueryDtoAfter implements AsSameProperties<FaqRessourcePostQueryDto> {}

export class FaqRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostBodyDtoAfter)
  public body: FaqRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostQueryDtoAfter)
  public query: FaqRessourcePostQueryDtoAfter
}
