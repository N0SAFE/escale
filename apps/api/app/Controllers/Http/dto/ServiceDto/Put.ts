import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ServiceRessourcePutBodyDto {}

export class ServiceRessourcePutQueryDto {}

export class ServiceRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePutBodyDto)
  public body: ServiceRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePutQueryDto)
  public query: ServiceRessourcePutQueryDto

  public get after() {
    return new ServiceRessourcePutDtoAfter(this)
  }
}

export class ServiceRessourcePutBodyDtoAfter
  implements AsSameProperties<ServiceRessourcePutBodyDto> {}

export class ServiceRessourcePutQueryDtoAfter
  implements AsSameProperties<ServiceRessourcePutQueryDto> {}

export class ServiceRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePutBodyDtoAfter)
  public body: ServiceRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePutQueryDtoAfter)
  public query: ServiceRessourcePutQueryDtoAfter
}
