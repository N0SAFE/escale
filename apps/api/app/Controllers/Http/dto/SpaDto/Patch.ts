import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class SpaRessourcePatchBodyDto {}

export class SpaRessourcePatchQueryDto {}

export class SpaRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchBodyDto)
  public body: SpaRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchQueryDto)
  public query: SpaRessourcePatchQueryDto

  public get after () {
    const dto = new SpaRessourcePatchDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class SpaRessourcePatchBodyDtoAfter implements AsSameProperties<SpaRessourcePatchBodyDto> {}

export class SpaRessourcePatchQueryDtoAfter
implements AsSameProperties<SpaRessourcePatchQueryDto> {}

export class SpaRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchBodyDtoAfter)
  public body: SpaRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchQueryDtoAfter)
  public query: SpaRessourcePatchQueryDtoAfter
}
