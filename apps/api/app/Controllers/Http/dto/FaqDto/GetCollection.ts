import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class FaqRessourceGetCollectionBodyDto {}

export class FaqRessourceGetCollectionQueryDto {}

export class FaqRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionBodyDto)
  public body: FaqRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionQueryDto)
  public query: FaqRessourceGetCollectionQueryDto

  public get after () {
    return new FaqRessourceGetCollectionDtoAfter(this)
  }
}

export class FaqRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<FaqRessourceGetCollectionBodyDto> {}

export class FaqRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<FaqRessourceGetCollectionQueryDto> {}

export class FaqRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionBodyDtoAfter)
  public body: FaqRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionQueryDtoAfter)
  public query: FaqRessourceGetCollectionQueryDtoAfter
}
