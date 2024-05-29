import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class UsersRessourceGetCollectionBodyDto {}

export class UsersRessourceGetCollectionQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public limit?: number
}

export class UsersRessourceGetCollectionParamsDto {}

@Exclude()
export class UsersRessourceGetCollectionFilesDto {}

@SkipTransform([['files', UsersRessourceGetCollectionFilesDto]])
export class UsersRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionBodyDto)
  public body: UsersRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionQueryDto)
  public query: UsersRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionParamsDto)
  public params: UsersRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionFilesDto)
  public files: UsersRessourceGetCollectionFilesDto

  public get after() {
    return new UsersRessourceGetCollectionDtoAfter(this)
  }

  public static fromRequest(request: RequestContract) {
    return new this({
      body: request.body(),
      query: request.qs(),
      params: request.params(),
      files: request.allFiles(),
    })
  }
}

export class UsersRessourceGetCollectionBodyDtoAfter
  implements AsSameProperties<UsersRessourceGetCollectionBodyDto> {}

export class UsersRessourceGetCollectionQueryDtoAfter
  implements AsSameProperties<UsersRessourceGetCollectionQueryDto>
{
  public page?: number
  public limit?: number
}

export class UsersRessourceGetCollectionParamsDtoAfter
  implements AsSameProperties<UsersRessourceGetCollectionParamsDto> {}

@Exclude()
export class UsersRessourceGetCollectionFilesDtoAfter
  implements AsSameProperties<UsersRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', UsersRessourceGetCollectionFilesDtoAfter]])
export class UsersRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<UsersRessourceGetCollectionDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionBodyDtoAfter)
  public body: UsersRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionQueryDtoAfter)
  public query: UsersRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionParamsDtoAfter)
  public params: UsersRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UsersRessourceGetCollectionFilesDtoAfter)
  public files: UsersRessourceGetCollectionFilesDtoAfter
}
