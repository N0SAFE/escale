import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UsersRessourcePostBodyDto {}

export class UsersRessourcePostQueryDto {}

export class UsersRessourcePostParamsDto {}

@Exclude()
export class UsersRessourcePostFilesDto {}

@SkipTransform([['files', UsersRessourcePostFilesDto]])
export class UsersRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostBodyDto)
  public body: UsersRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostQueryDto)
  public query: UsersRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostParamsDto)
  public params: UsersRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostFilesDto)
  public files: UsersRessourcePostFilesDto

  public get after () {
    return new UsersRessourcePostDtoAfter(this)
  }

  public static fromRequest (request: RequestContract) {
    return new this({
      body: request.body(),
      query: request.qs(),
      params: request.params(),
      files: request.allFiles(),
    })
  }
}

export class UsersRessourcePostBodyDtoAfter
implements AsSameProperties<UsersRessourcePostBodyDto> {}

export class UsersRessourcePostQueryDtoAfter
implements AsSameProperties<UsersRessourcePostQueryDto> {}

export class UsersRessourcePostParamsDtoAfter
implements AsSameProperties<UsersRessourcePostParamsDto> {}

@Exclude()
export class UsersRessourcePostFilesDtoAfter
implements AsSameProperties<UsersRessourcePostFilesDto> {}

@SkipTransform([['files', UsersRessourcePostFilesDtoAfter]])
export class UsersRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UsersRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostBodyDtoAfter)
  public body: UsersRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostQueryDtoAfter)
  public query: UsersRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostParamsDtoAfter)
  public params: UsersRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourcePostFilesDtoAfter)
  public files: UsersRessourcePostFilesDtoAfter
}
