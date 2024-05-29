import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class FaqRessourcePutBodyDto {}

export class FaqRessourcePutQueryDto {}

export class FaqRessourcePutParamsDto {}

@Exclude()
export class FaqRessourcePutFilesDto {}

@SkipTransform([['files', FaqRessourcePutFilesDto]])
export class FaqRessourcePutDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutBodyDto)
  public body: FaqRessourcePutBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutQueryDto)
  public query: FaqRessourcePutQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutParamsDto)
  public params: FaqRessourcePutParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutFilesDto)
  public files: FaqRessourcePutFilesDto

  public get after() {
    return new FaqRessourcePutDtoAfter(this)
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

export class FaqRessourcePutBodyDtoAfter implements AsSameProperties<FaqRessourcePutBodyDto> {}

export class FaqRessourcePutQueryDtoAfter implements AsSameProperties<FaqRessourcePutQueryDto> {}

export class FaqRessourcePutParamsDtoAfter implements AsSameProperties<FaqRessourcePutParamsDto> {}

@Exclude()
export class FaqRessourcePutFilesDtoAfter implements AsSameProperties<FaqRessourcePutFilesDto> {}

@SkipTransform([['files', FaqRessourcePutFilesDtoAfter]])
export class FaqRessourcePutDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<FaqRessourcePutDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutBodyDtoAfter)
  public body: FaqRessourcePutBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutQueryDtoAfter)
  public query: FaqRessourcePutQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutParamsDtoAfter)
  public params: FaqRessourcePutParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourcePutFilesDtoAfter)
  public files: FaqRessourcePutFilesDtoAfter
}
