import { IsArray, IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../../BaseDto'
import { SkipTransform } from '../../Decorator/SkipTransform'
import { AwaitPromise } from '../../Decorator/AwaitPromise'
import Spa from 'App/Models/Spa'
import { EntityExist } from '../../Decorator/EntityExist'

class SortedImage extends BaseDto {
  @IsDefined()
  @IsNumber()
  public id: number

  @IsDefined()
  @IsNumber()
  public order: number
}

export class SpaImageRessourceSortBodyDto {
  @IsDefined()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  public sorted: SortedImage[]
}

export class SpaImageRessourceSortQueryDto {}

export class SpaImageRessourceSortParamsDto {
  @IsDefined()
  @EntityExist(Spa)
  @IsNumber()
  @Type(() => Number)
  public spa: number
}

@Exclude()
export class SpaImageRessourceSortFilesDto {}

@SkipTransform([['files', SpaImageRessourceSortFilesDto]])
export class SpaImageRessourceSortDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortBodyDto)
  public body: SpaImageRessourceSortBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortQueryDto)
  public query: SpaImageRessourceSortQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortParamsDto)
  public params: SpaImageRessourceSortParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortFilesDto)
  public files: SpaImageRessourceSortFilesDto

  public get after () {
    return new SpaImageRessourceSortDtoAfter(this)
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

export class SpaImageRessourceSortBodyDtoAfter
implements AsSameProperties<SpaImageRessourceSortBodyDto> {
  public sorted: SortedImage[]
}

export class SpaImageRessourceSortQueryDtoAfter
implements AsSameProperties<SpaImageRessourceSortQueryDto> {}

export class SpaImageRessourceSortParamsDtoAfter
implements AsSameProperties<SpaImageRessourceSortParamsDto> {
  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa
}

@Exclude()
export class SpaImageRessourceSortFilesDtoAfter
implements AsSameProperties<SpaImageRessourceSortFilesDto> {}

@SkipTransform([['files', SpaImageRessourceSortFilesDtoAfter]])
export class SpaImageRessourceSortDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaImageRessourceSortDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortBodyDtoAfter)
  public body: SpaImageRessourceSortBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortQueryDtoAfter)
  public query: SpaImageRessourceSortQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortParamsDtoAfter)
  public params: SpaImageRessourceSortParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourceSortFilesDtoAfter)
  public files: SpaImageRessourceSortFilesDtoAfter
}
