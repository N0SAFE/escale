import {
  IsDefined,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FaqRessourcePutBodyDto {}

export class FaqRessourcePutQueryDto {}

export class FaqRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutBodyDto)
  public body: FaqRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutQueryDto)
  public query: FaqRessourcePutQueryDto

  public get after () {
    return new FaqRessourcePutDtoAfter(this)
  }
}

export class FaqRessourcePutBodyDtoAfter implements AsSameProperties<FaqRessourcePutBodyDto> {}

export class FaqRessourcePutQueryDtoAfter implements AsSameProperties<FaqRessourcePutQueryDto> {}

export class FaqRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutBodyDtoAfter)
  public body: FaqRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutQueryDtoAfter)
  public query: FaqRessourcePutQueryDtoAfter
}
