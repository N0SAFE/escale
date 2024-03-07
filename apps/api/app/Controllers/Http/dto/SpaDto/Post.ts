import { IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Image from 'App/Models/Image'
import Service from 'App/Models/Service'

export class SpaImages extends BaseDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Image)
  public image: number

  @IsDefined()
  @IsNumber()
  public order: number
}

export class SpaRessourcePostBodyDto {
  @IsDefined()
  @IsString()
  public title: string

  @IsDefined()
  @IsString()
  public description: string

  @IsDefined()
  @IsString()
  public location: string

  @IsDefined()
  @IsString()
  public googleMapsLink: string

  @IsDefined()
  @ValidateNested({ each: true })
  public spaImages: SpaImages[]

  @IsDefined()
  @IsNumber({}, { each: true })
  @EntityExist(Service, { each: true })
  public services: number[]
}

export class SpaRessourcePostQueryDto {}

export class SpaRessourcePostParamsDto {}

@Exclude()
export class SpaRessourcePostFilesDto {}

@SkipTransform([['files', SpaRessourcePostFilesDto]])
export class SpaRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostBodyDto)
  public body: SpaRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostQueryDto)
  public query: SpaRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostParamsDto)
  public params: SpaRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostFilesDto)
  public files: SpaRessourcePostFilesDto

  public get after () {
    return new SpaRessourcePostDtoAfter(this)
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

export class SpaRessourcePostBodyDtoAfter implements AsSameProperties<SpaRessourcePostBodyDto> {
  public title: string
  public description: string
  public location: string
  public googleMapsLink: string
  public spaImages: SpaImages[]
  public services: number[]
}

export class SpaRessourcePostQueryDtoAfter implements AsSameProperties<SpaRessourcePostQueryDto> {}

export class SpaRessourcePostParamsDtoAfter
implements AsSameProperties<SpaRessourcePostParamsDto> {}

@Exclude()
export class SpaRessourcePostFilesDtoAfter implements AsSameProperties<SpaRessourcePostFilesDto> {}

@SkipTransform([['files', SpaRessourcePostFilesDtoAfter]])
export class SpaRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostBodyDtoAfter)
  public body: SpaRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostQueryDtoAfter)
  public query: SpaRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostParamsDtoAfter)
  public params: SpaRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePostFilesDtoAfter)
  public files: SpaRessourcePostFilesDtoAfter
}
