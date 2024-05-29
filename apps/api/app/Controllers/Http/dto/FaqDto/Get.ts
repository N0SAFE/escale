import { IsDefined, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'

export class FaqRessourceGetBodyDto {}

export class FaqRessourceGetQueryDto {}

export class FaqRessourceGetParamsDto {}

@Exclude()
export class FaqRessourceGetFilesDto {}

@SkipTransform([['files', FaqRessourceGetFilesDto]])
export class FaqRessourceGetDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetBodyDto)
  public body: FaqRessourceGetBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetQueryDto)
  public query: FaqRessourceGetQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetParamsDto)
  public params: FaqRessourceGetParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetFilesDto)
  public files: FaqRessourceGetFilesDto

  public get after() {
    return new FaqRessourceGetDtoAfter(this)
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

export class FaqRessourceGetBodyDtoAfter implements AsSameProperties<FaqRessourceGetBodyDto> {}

export class FaqRessourceGetQueryDtoAfter implements AsSameProperties<FaqRessourceGetQueryDto> {}

export class FaqRessourceGetParamsDtoAfter implements AsSameProperties<FaqRessourceGetParamsDto> {}

@Exclude()
export class FaqRessourceGetFilesDtoAfter implements AsSameProperties<FaqRessourceGetFilesDto> {}

@SkipTransform([['files', FaqRessourceGetFilesDtoAfter]])
export class FaqRessourceGetDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<FaqRessourceGetDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetBodyDtoAfter)
  public body: FaqRessourceGetBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetQueryDtoAfter)
  public query: FaqRessourceGetQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetParamsDtoAfter)
  public params: FaqRessourceGetParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => FaqRessourceGetFilesDtoAfter)
  public files: FaqRessourceGetFilesDtoAfter
}
