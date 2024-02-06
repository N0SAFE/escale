import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class SpaRessourceDeleteBodyDto {}

export class SpaRessourceDeleteQueryDto {}

export class SpaRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteBodyDto)
  public body: SpaRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteQueryDto)
  public query: SpaRessourceDeleteQueryDto

  public get after () {
    const dto = new SpaRessourceDeleteDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class SpaRessourceDeleteBodyDtoAfter
implements AsSameProperties<SpaRessourceDeleteBodyDto> {}

export class SpaRessourceDeleteQueryDtoAfter
implements AsSameProperties<SpaRessourceDeleteQueryDto> {}

export class SpaRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteBodyDtoAfter)
  public body: SpaRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceDeleteQueryDtoAfter)
  public query: SpaRessourceDeleteQueryDtoAfter
}
