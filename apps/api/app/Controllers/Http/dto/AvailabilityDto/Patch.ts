import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class AvailabilityRessourcePatchBodyDto {}

export class AvailabilityRessourcePatchQueryDto {}

export class AvailabilityRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchBodyDto)
  public body: AvailabilityRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchQueryDto)
  public query: AvailabilityRessourcePatchQueryDto

  public get after () {
    const dto = new AvailabilityRessourcePatchDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class AvailabilityRessourcePatchBodyDtoAfter
implements AsSameProperties<AvailabilityRessourcePatchBodyDto> {}

export class AvailabilityRessourcePatchQueryDtoAfter
implements AsSameProperties<AvailabilityRessourcePatchQueryDto> {}

export class AvailabilityRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchBodyDtoAfter)
  public body: AvailabilityRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourcePatchQueryDtoAfter)
  public query: AvailabilityRessourcePatchQueryDtoAfter
}
