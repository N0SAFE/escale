import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class ServiceRessourcePostBodyDto {}

export class ServiceRessourcePostQueryDto {}

export class ServiceRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostBodyDto)
  public body: ServiceRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostQueryDto)
  public query: ServiceRessourcePostQueryDto

  public get after () {
    return new ServiceRessourcePostDtoAfter(this)
  }
}

export class ServiceRessourcePostBodyDtoAfter
implements AsSameProperties<ServiceRessourcePostBodyDto> {}

export class ServiceRessourcePostQueryDtoAfter
implements AsSameProperties<ServiceRessourcePostQueryDto> {}

export class ServiceRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostBodyDtoAfter)
  public body: ServiceRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostQueryDtoAfter)
  public query: ServiceRessourcePostQueryDtoAfter
}
