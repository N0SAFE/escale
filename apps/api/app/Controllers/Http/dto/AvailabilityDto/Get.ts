import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class AvailabilityRessourceGetBodyDto {}

export class AvailabilityRessourceGetQueryDto {}

export class AvailabilityRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetBodyDto)
  public body: AvailabilityRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetQueryDto)
  public query: AvailabilityRessourceGetQueryDto

  public get after () {
    const dto = new AvailabilityRessourceGetDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class AvailabilityRessourceGetBodyDtoAfter
implements AsSameProperties<AvailabilityRessourceGetBodyDto> {}

export class AvailabilityRessourceGetQueryDtoAfter
implements AsSameProperties<AvailabilityRessourceGetQueryDto> {}

export class AvailabilityRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetBodyDtoAfter)
  public body: AvailabilityRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceGetQueryDtoAfter)
  public query: AvailabilityRessourceGetQueryDtoAfter
}
