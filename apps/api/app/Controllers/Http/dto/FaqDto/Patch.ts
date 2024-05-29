import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import Faq from 'App/Models/Faq'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import { EntityExist } from '../Decorator/EntityExist'

export class FaqRessourcePatchBodyDto {
  @IsOptional()
  public question: string

  @IsOptional()
  public answer: string
}

export class FaqRessourcePatchQueryDto {}

export class FaqRessourcePatchParamsDto {
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @EntityExist(Faq)
  public id: number
}

@Exclude()
export class FaqRessourcePatchFilesDto {}

@SkipTransform([['files', FaqRessourcePatchFilesDto]])
export class FaqRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchBodyDto)
  public body: FaqRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchQueryDto)
  public query: FaqRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchParamsDto)
  public params: FaqRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchFilesDto)
  public files: FaqRessourcePatchFilesDto

  public get after() {
    return new FaqRessourcePatchDtoAfter(this)
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

export class FaqRessourcePatchBodyDtoAfter implements AsSameProperties<FaqRessourcePatchBodyDto> {
  public question: string

  public answer: string

  public faqId: number
}

export class FaqRessourcePatchQueryDtoAfter implements AsSameProperties<FaqRessourcePatchQueryDto> {
  public question: string
  public answer: string
}

export class FaqRessourcePatchParamsDtoAfter
  implements AsSameProperties<FaqRessourcePatchParamsDto>
{
  @Transform(({ value }) => Faq.findOrFail(value))
  @AwaitPromise
  public id: Faq
}

@Exclude()
export class FaqRessourcePatchFilesDtoAfter
  implements AsSameProperties<FaqRessourcePatchFilesDto> {}

@SkipTransform([['files', FaqRessourcePatchFilesDtoAfter]])
export class FaqRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<FaqRessourcePatchDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchBodyDtoAfter)
  public body: FaqRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchQueryDtoAfter)
  public query: FaqRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchParamsDtoAfter)
  public params: FaqRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePatchFilesDtoAfter)
  public files: FaqRessourcePatchFilesDtoAfter
}
