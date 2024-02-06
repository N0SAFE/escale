import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class AvailabilityRessourceGetCollectionBodyDto {}

export class AvailabilityRessourceGetCollectionQueryDto {}

export class AvailabilityRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionBodyDto)
  public body: AvailabilityRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionQueryDto)
  public query: AvailabilityRessourceGetCollectionQueryDto

  public get after () {
    const dto = new AvailabilityRessourceGetCollectionDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class AvailabilityRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<AvailabilityRessourceGetCollectionBodyDto> {}

export class AvailabilityRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<AvailabilityRessourceGetCollectionQueryDto> {}

export class AvailabilityRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionBodyDtoAfter)
  public body: AvailabilityRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetCollectionQueryDtoAfter)
  public query: AvailabilityRessourceGetCollectionQueryDtoAfter
}
