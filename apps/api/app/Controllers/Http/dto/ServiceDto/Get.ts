import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ServiceRessourceGetBodyDto {}

export class ServiceRessourceGetQueryDto {}

export class ServiceRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetBodyDto)
  public body: ServiceRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetQueryDto)
  public query: ServiceRessourceGetQueryDto

  public get after () {
    return new ServiceRessourceGetDtoAfter(this)
  }
}

export class ServiceRessourceGetBodyDtoAfter
implements AsSameProperties<ServiceRessourceGetBodyDto> {}

export class ServiceRessourceGetQueryDtoAfter
implements AsSameProperties<ServiceRessourceGetQueryDto> {}

export class ServiceRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetBodyDtoAfter)
  public body: ServiceRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetQueryDtoAfter)
  public query: ServiceRessourceGetQueryDtoAfter
}
