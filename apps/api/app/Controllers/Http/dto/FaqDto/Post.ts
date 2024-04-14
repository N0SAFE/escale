import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class FaqRessourcePostBodyDto {
  @IsDefined()
  public question: string

  @IsDefined()
  public answer: string
}

export class FaqRessourcePostQueryDto {}

export class FaqRessourcePostParamsDto {}

@Exclude()
export class FaqRessourcePostFilesDto {}

@SkipTransform([['files', FaqRessourcePostFilesDto]])
export class FaqRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostBodyDto)
  public body: FaqRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostQueryDto)
  public query: FaqRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostParamsDto)
  public params: FaqRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostFilesDto)
  public files: FaqRessourcePostFilesDto

  public get after () {
    return new FaqRessourcePostDtoAfter(this)
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

export class FaqRessourcePostBodyDtoAfter implements AsSameProperties<FaqRessourcePostBodyDto> {
  public question: string
  public answer: string
}

export class FaqRessourcePostQueryDtoAfter implements AsSameProperties<FaqRessourcePostQueryDto> {}

export class FaqRessourcePostParamsDtoAfter
implements AsSameProperties<FaqRessourcePostParamsDto> {}

@Exclude()
export class FaqRessourcePostFilesDtoAfter implements AsSameProperties<FaqRessourcePostFilesDto> {}

@SkipTransform([['files', FaqRessourcePostFilesDtoAfter]])
export class FaqRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<FaqRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostBodyDtoAfter)
  public body: FaqRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostQueryDtoAfter)
  public query: FaqRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostParamsDtoAfter)
  public params: FaqRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePostFilesDtoAfter)
  public files: FaqRessourcePostFilesDtoAfter
}
