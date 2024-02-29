import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../../BaseDto'
import { SkipTransform } from '../../Decorator/SkipTransform'
import { EntityExist } from '../../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import SpaImage from 'App/Models/SpaImage'
import { AwaitPromise } from '../../Decorator/AwaitPromise'

export class SpaImageRessourceDeleteBodyDto {}

export class SpaImageRessourceDeleteQueryDto {}

export class SpaImageRessourceDeleteParamsDto {
  @IsDefined()
  @EntityExist(Spa)
  @IsNumber()
  @Type(() => Number)
  public spa: number

  @IsDefined()
  @EntityExist(SpaImage)
  @IsNumber()
  @Type(() => Number)
  public spaImage: number
}

@Exclude()
export class SpaImageRessourceDeleteFilesDto {}

@SkipTransform([['files', SpaImageRessourceDeleteFilesDto]])
export class SpaImageRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteBodyDto)
  public body: SpaImageRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteQueryDto)
  public query: SpaImageRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteParamsDto)
  public params: SpaImageRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteFilesDto)
  public files: SpaImageRessourceDeleteFilesDto

  public get after () {
    return new SpaImageRessourceDeleteDtoAfter(this)
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

export class SpaImageRessourceDeleteBodyDtoAfter
implements AsSameProperties<SpaImageRessourceDeleteBodyDto> {}

export class SpaImageRessourceDeleteQueryDtoAfter
implements AsSameProperties<SpaImageRessourceDeleteQueryDto> {}

export class SpaImageRessourceDeleteParamsDtoAfter
implements AsSameProperties<SpaImageRessourceDeleteParamsDto> {
  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa

  @Transform(async ({ value }) => await SpaImage.findOrFail(value))
  @AwaitPromise
  public spaImage: SpaImage
}

@Exclude()
export class SpaImageRessourceDeleteFilesDtoAfter
implements AsSameProperties<SpaImageRessourceDeleteFilesDto> {}

@SkipTransform([['files', SpaImageRessourceDeleteFilesDtoAfter]])
export class SpaImageRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaImageRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteBodyDtoAfter)
  public body: SpaImageRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteQueryDtoAfter)
  public query: SpaImageRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteParamsDtoAfter)
  public params: SpaImageRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceDeleteFilesDtoAfter)
  public files: SpaImageRessourceDeleteFilesDtoAfter
}
