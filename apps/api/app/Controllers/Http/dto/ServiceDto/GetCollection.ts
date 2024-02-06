import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ServiceRessourceGetCollectionBodyDto {}

export class ServiceRessourceGetCollectionQueryDto {}

export class ServiceRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetCollectionBodyDto)
  public body: ServiceRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetCollectionQueryDto)
  public query: ServiceRessourceGetCollectionQueryDto

  public get after () {
    return new ServiceRessourceGetCollectionDtoAfter(this)
  }
}

export class ServiceRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<ServiceRessourceGetCollectionBodyDto> {}

export class ServiceRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<ServiceRessourceGetCollectionQueryDto> {}

export class ServiceRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetCollectionBodyDtoAfter)
  public body: ServiceRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceGetCollectionQueryDtoAfter)
  public query: ServiceRessourceGetCollectionQueryDtoAfter
}
