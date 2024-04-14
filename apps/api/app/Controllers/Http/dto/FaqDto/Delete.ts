import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import Faq from 'App/Models/Faq'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { EntityExist } from '../Decorator/EntityExist'

export class FaqRessourceDeleteBodyDto {}

export class FaqRessourceDeleteQueryDto {}

export class FaqRessourceDeleteParamsDto {
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @EntityExist(Faq)
  public id: number
}

@Exclude()
export class FaqRessourceDeleteFilesDto {}

@SkipTransform([['files', FaqRessourceDeleteFilesDto]])
export class FaqRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteBodyDto)
  public body: FaqRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteQueryDto)
  public query: FaqRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteParamsDto)
  public params: FaqRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteFilesDto)
  public files: FaqRessourceDeleteFilesDto

  public get after () {
    return new FaqRessourceDeleteDtoAfter(this)
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

export class FaqRessourceDeleteBodyDtoAfter
implements AsSameProperties<FaqRessourceDeleteBodyDto> {}

export class FaqRessourceDeleteQueryDtoAfter
implements AsSameProperties<FaqRessourceDeleteQueryDto> {}

export class FaqRessourceDeleteParamsDtoAfter
implements AsSameProperties<FaqRessourceDeleteParamsDto> {
  @Transform(({ value }) => Faq.findOrFail(value))
  @AwaitPromise
  public id: Faq
}

@Exclude()
export class FaqRessourceDeleteFilesDtoAfter
implements AsSameProperties<FaqRessourceDeleteFilesDto> {}

@SkipTransform([['files', FaqRessourceDeleteFilesDtoAfter]])
export class FaqRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<FaqRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteBodyDtoAfter)
  public body: FaqRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteQueryDtoAfter)
  public query: FaqRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteParamsDtoAfter)
  public params: FaqRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceDeleteFilesDtoAfter)
  public files: FaqRessourceDeleteFilesDtoAfter
}
