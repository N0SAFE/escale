import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ServiceRessourcePatchBodyDto {}

export class ServiceRessourcePatchQueryDto {}

export class ServiceRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchBodyDto)
  public body: ServiceRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchQueryDto)
  public query: ServiceRessourcePatchQueryDto

  public get after () {
    return new ServiceRessourcePatchDtoAfter(this)
  }
}

export class ServiceRessourcePatchBodyDtoAfter
implements AsSameProperties<ServiceRessourcePatchBodyDto> {}

export class ServiceRessourcePatchQueryDtoAfter
implements AsSameProperties<ServiceRessourcePatchQueryDto> {}

export class ServiceRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchBodyDtoAfter)
  public body: ServiceRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchQueryDtoAfter)
  public query: ServiceRessourcePatchQueryDtoAfter
}
