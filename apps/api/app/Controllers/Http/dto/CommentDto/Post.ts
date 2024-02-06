import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class CommentRessourcePostBodyDto {}

export class CommentRessourcePostQueryDto {}

export class CommentRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePostBodyDto)
  public body: CommentRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePostQueryDto)
  public query: CommentRessourcePostQueryDto

  public get after () {
    return new CommentRessourcePostDtoAfter(this)
  }
}

export class CommentRessourcePostBodyDtoAfter
implements AsSameProperties<CommentRessourcePostBodyDto> {}

export class CommentRessourcePostQueryDtoAfter
implements AsSameProperties<CommentRessourcePostQueryDto> {}

export class CommentRessourcePostDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePostBodyDtoAfter)
  public body: CommentRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePostQueryDtoAfter)
  public query: CommentRessourcePostQueryDtoAfter
}
