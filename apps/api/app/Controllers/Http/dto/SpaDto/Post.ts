import { IsArray, IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class SpaRessourcePostBodyDto {
  @IsDefined()
  public name: string

  @IsDefined()
  public description: string

  @IsDefined()
  @IsArray()
  public images?: string[] = []
}

export class SpaRessourcePostQueryDto {}

export class SpaRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostBodyDto)
  public body: SpaRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostQueryDto)
  public query: SpaRessourcePostQueryDto

  public get after () {
    const dto = new SpaRessourcePostDtoAfter(this)
    return dto.transform({ groups: ['after'] })
  }
}

export class SpaRessourcePostBodyDtoAfter implements AsSameProperties<SpaRessourcePostBodyDto> {
  public name: string
  public description: string
  public images?: string[] = []
}

export class SpaRessourcePostQueryDtoAfter implements AsSameProperties<SpaRessourcePostQueryDto> {}

export class SpaRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostBodyDtoAfter)
  public body: SpaRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostQueryDtoAfter)
  public query: SpaRessourcePostQueryDtoAfter
}
