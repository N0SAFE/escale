import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class SpaRessourceGetBodyDto {}

export class SpaRessourceGetQueryDto {}

export class SpaRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetBodyDto)
  public body: SpaRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetQueryDto)
  public query: SpaRessourceGetQueryDto

  public get after () {
    const dto = new SpaRessourceGetDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class SpaRessourceGetBodyDtoAfter implements AsSameProperties<SpaRessourceGetBodyDto> {}

export class SpaRessourceGetQueryDtoAfter implements AsSameProperties<SpaRessourceGetQueryDto> {}

export class SpaRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetBodyDtoAfter)
  public body: SpaRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetQueryDtoAfter)
  public query: SpaRessourceGetQueryDtoAfter
}
