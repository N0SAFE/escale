import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class CommentRessourceGetBodyDto {}

export class CommentRessourceGetQueryDto {}

export class CommentRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetBodyDto)
  public body: CommentRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetQueryDto)
  public query: CommentRessourceGetQueryDto

  public get after() {
    return new CommentRessourceGetDtoAfter(this)
  }
}

export class CommentRessourceGetBodyDtoAfter
  implements AsSameProperties<CommentRessourceGetBodyDto> {}

export class CommentRessourceGetQueryDtoAfter
  implements AsSameProperties<CommentRessourceGetQueryDto> {}

export class CommentRessourceGetDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetBodyDtoAfter)
  public body: CommentRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetQueryDtoAfter)
  public query: CommentRessourceGetQueryDtoAfter
}
