import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class AvailabilityRessourceDeleteBodyDto {}

export class AvailabilityRessourceDeleteQueryDto {}

export class AvailabilityRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteBodyDto)
  public body: AvailabilityRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteQueryDto)
  public query: AvailabilityRessourceDeleteQueryDto

  public get after () {
    const dto = new AvailabilityRessourceDeleteDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class AvailabilityRessourceDeleteBodyDtoAfter
implements AsSameProperties<AvailabilityRessourceDeleteBodyDto> {}

export class AvailabilityRessourceDeleteQueryDtoAfter
implements AsSameProperties<AvailabilityRessourceDeleteQueryDto> {}

export class AvailabilityRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteBodyDtoAfter)
  public body: AvailabilityRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteQueryDtoAfter)
  public query: AvailabilityRessourceDeleteQueryDtoAfter
}
