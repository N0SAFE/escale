import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class SpaRessourcePutBodyDto {}

export class SpaRessourcePutQueryDto {}

export class SpaRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePutBodyDto)
  public body: SpaRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePutQueryDto)
  public query: SpaRessourcePutQueryDto

  public get after () {
    const dto = new SpaRessourcePutDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class SpaRessourcePutBodyDtoAfter implements AsSameProperties<SpaRessourcePutBodyDto> {}

export class SpaRessourcePutQueryDtoAfter implements AsSameProperties<SpaRessourcePutQueryDto> {}

export class SpaRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePutBodyDtoAfter)
  public body: SpaRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePutQueryDtoAfter)
  public query: SpaRessourcePutQueryDtoAfter
}
