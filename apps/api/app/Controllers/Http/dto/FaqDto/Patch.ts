import {
  IsDefined,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FaqRessourcePatchBodyDto {}

export class FaqRessourcePatchQueryDto {}

export class FaqRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchBodyDto)
  public body: FaqRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchQueryDto)
  public query: FaqRessourcePatchQueryDto

  public get after () {
    return new FaqRessourcePatchDtoAfter(this)
  }
}

export class FaqRessourcePatchBodyDtoAfter implements AsSameProperties<FaqRessourcePatchBodyDto> {}

export class FaqRessourcePatchQueryDtoAfter implements AsSameProperties<FaqRessourcePatchQueryDto> {}

export class FaqRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchBodyDtoAfter)
  public body: FaqRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchQueryDtoAfter)
  public query: FaqRessourcePatchQueryDtoAfter
}
