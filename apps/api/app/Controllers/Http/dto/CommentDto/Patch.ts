import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class CommentRessourcePatchBodyDto {}

export class CommentRessourcePatchQueryDto {}

export class CommentRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePatchBodyDto)
  public body: CommentRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePatchQueryDto)
  public query: CommentRessourcePatchQueryDto

  public get after() {
    return new CommentRessourcePatchDtoAfter(this)
  }
}

export class CommentRessourcePatchBodyDtoAfter
  implements AsSameProperties<CommentRessourcePatchBodyDto> {}

export class CommentRessourcePatchQueryDtoAfter
  implements AsSameProperties<CommentRessourcePatchQueryDto> {}

export class CommentRessourcePatchDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePatchBodyDtoAfter)
  public body: CommentRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePatchQueryDtoAfter)
  public query: CommentRessourcePatchQueryDtoAfter
}
