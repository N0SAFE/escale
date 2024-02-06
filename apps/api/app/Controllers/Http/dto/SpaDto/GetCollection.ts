import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class SpaRessourceGetCollectionBodyDto {}

export class SpaRessourceGetCollectionQueryDto {}

export class SpaRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetCollectionBodyDto)
  public body: SpaRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetCollectionQueryDto)
  public query: SpaRessourceGetCollectionQueryDto

  public get after () {
    const dto = new SpaRessourceGetCollectionDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class SpaRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<SpaRessourceGetCollectionBodyDto> {}

export class SpaRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<SpaRessourceGetCollectionQueryDto> {}

export class SpaRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetCollectionBodyDtoAfter)
  public body: SpaRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourceGetCollectionQueryDtoAfter)
  public query: SpaRessourceGetCollectionQueryDtoAfter
}
