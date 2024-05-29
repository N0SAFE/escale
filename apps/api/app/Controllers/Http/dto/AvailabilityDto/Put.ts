import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class AvailabilityRessourcePutBodyDto {}

export class AvailabilityRessourcePutQueryDto {}

export class AvailabilityRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePutBodyDto)
  public body: AvailabilityRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePutQueryDto)
  public query: AvailabilityRessourcePutQueryDto

  public get after() {
    const dto = new AvailabilityRessourcePutDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class AvailabilityRessourcePutBodyDtoAfter
  implements AsSameProperties<AvailabilityRessourcePutBodyDto> {}

export class AvailabilityRessourcePutQueryDtoAfter
  implements AsSameProperties<AvailabilityRessourcePutQueryDto> {}

export class AvailabilityRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePutBodyDtoAfter)
  public body: AvailabilityRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePutQueryDtoAfter)
  public query: AvailabilityRessourcePutQueryDtoAfter
}
