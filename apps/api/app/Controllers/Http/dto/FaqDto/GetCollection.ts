import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class FaqRessourceGetCollectionBodyDto {}

export class FaqRessourceGetCollectionQueryDto {}

export class FaqRessourceGetCollectionParamsDto {}

@Exclude()
export class FaqRessourceGetCollectionFilesDto {}

@SkipTransform([['files', FaqRessourceGetCollectionFilesDto]])
export class FaqRessourceGetCollectionDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionBodyDto)
  public body: FaqRessourceGetCollectionBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionQueryDto)
  public query: FaqRessourceGetCollectionQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionParamsDto)
  public params: FaqRessourceGetCollectionParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionFilesDto)
  public files: FaqRessourceGetCollectionFilesDto

  public get after () {
    return new FaqRessourceGetCollectionDtoAfter(this)
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

export class FaqRessourceGetCollectionBodyDtoAfter
implements AsSameProperties<FaqRessourceGetCollectionBodyDto> {}

export class FaqRessourceGetCollectionQueryDtoAfter
implements AsSameProperties<FaqRessourceGetCollectionQueryDto> {}

export class FaqRessourceGetCollectionParamsDtoAfter
implements AsSameProperties<FaqRessourceGetCollectionParamsDto> {}

@Exclude()
export class FaqRessourceGetCollectionFilesDtoAfter
implements AsSameProperties<FaqRessourceGetCollectionFilesDto> {}

@SkipTransform([['files', FaqRessourceGetCollectionFilesDtoAfter]])
export class FaqRessourceGetCollectionDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<FaqRessourceGetCollectionDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionBodyDtoAfter)
  public body: FaqRessourceGetCollectionBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionQueryDtoAfter)
  public query: FaqRessourceGetCollectionQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionParamsDtoAfter)
  public params: FaqRessourceGetCollectionParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetCollectionFilesDtoAfter)
  public files: FaqRessourceGetCollectionFilesDtoAfter
}
