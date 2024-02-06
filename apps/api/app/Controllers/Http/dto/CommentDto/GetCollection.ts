import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class CommentRessourceGetCollectionBodyDto {}

export class CommentRessourceGetCollectionQueryDto {}

export class CommentRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetCollectionBodyDto)
  public body: CommentRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetCollectionQueryDto)
  public query: CommentRessourceGetCollectionQueryDto

  public get after () {
    return new CommentRessourceGetCollectionDtoAfter(this)
  }
}

export class CommentRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<CommentRessourceGetCollectionBodyDto> {}

export class CommentRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<CommentRessourceGetCollectionQueryDto> {}

export class CommentRessourceGetCollectionDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetCollectionBodyDtoAfter)
  public body: CommentRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourceGetCollectionQueryDtoAfter)
  public query: CommentRessourceGetCollectionQueryDtoAfter
}
