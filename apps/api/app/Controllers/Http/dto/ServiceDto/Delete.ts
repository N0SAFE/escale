import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ServiceRessourceDeleteBodyDto {}

export class ServiceRessourceDeleteQueryDto {}

export class ServiceRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteBodyDto)
  public body: ServiceRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteQueryDto)
  public query: ServiceRessourceDeleteQueryDto

  public get after () {
    return new ServiceRessourceDeleteDtoAfter(this)
  }
}

export class ServiceRessourceDeleteBodyDtoAfter
implements AsSameProperties<ServiceRessourceDeleteBodyDto> {}

export class ServiceRessourceDeleteQueryDtoAfter
implements AsSameProperties<ServiceRessourceDeleteQueryDto> {}

export class ServiceRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteBodyDtoAfter)
  public body: ServiceRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteQueryDtoAfter)
  public query: ServiceRessourceDeleteQueryDtoAfter
}
