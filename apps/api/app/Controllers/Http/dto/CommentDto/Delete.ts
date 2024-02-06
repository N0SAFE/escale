import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class CommentRessourceDeleteBodyDto {}

export class CommentRessourceDeleteQueryDto {}

export class CommentRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceDeleteBodyDto)
  public body: CommentRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceDeleteQueryDto)
  public query: CommentRessourceDeleteQueryDto

  public get after () {
    return new CommentRessourceDeleteDtoAfter(this)
  }
}

export class CommentRessourceDeleteBodyDtoAfter
implements AsSameProperties<CommentRessourceDeleteBodyDto> {}

export class CommentRessourceDeleteQueryDtoAfter
implements AsSameProperties<CommentRessourceDeleteQueryDto> {}

export class CommentRessourceDeleteDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceDeleteBodyDtoAfter)
  public body: CommentRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceDeleteQueryDtoAfter)
  public query: CommentRessourceDeleteQueryDtoAfter
}
