import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'

export class CommentRessourcePutBodyDto {}

export class CommentRessourcePutQueryDto {}

export class CommentRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePutBodyDto)
  public body: CommentRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePutQueryDto)
  public query: CommentRessourcePutQueryDto

  public get after() {
    return new CommentRessourcePutDtoAfter(this)
  }
}

export class CommentRessourcePutBodyDtoAfter
  implements AsSameProperties<CommentRessourcePutBodyDto> {}

export class CommentRessourcePutQueryDtoAfter
  implements AsSameProperties<CommentRessourcePutQueryDto> {}

export class CommentRessourcePutDtoAfter extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePutBodyDtoAfter)
  public body: CommentRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CommentRessourcePutQueryDtoAfter)
  public query: CommentRessourcePutQueryDtoAfter
}
