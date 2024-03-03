import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Service from 'App/Models/Service'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import Spa from 'App/Models/Spa'
import Image from 'App/Models/Image'

export class SpaImages extends BaseDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Image)
  public image: number

  @IsDefined()
  @IsNumber()
  public order: number
}

export class SpaRessourcePatchBodyDto {
  @IsOptional()
  public title?: string

  @IsOptional()
  public description?: string

  @IsOptional()
  @ValidateNested({ each: true })
  public spaImages?: SpaImages[]

  @IsOptional()
  public location?: string

  @IsOptional()
  public google_maps_link?: string
}

export class SpaRessourcePatchQueryDto {}

export class SpaRessourcePatchParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Service)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class SpaRessourcePatchFilesDto {}

@SkipTransform([['files', SpaRessourcePatchFilesDto]])
export class SpaRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchBodyDto)
  public body: SpaRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchQueryDto)
  public query: SpaRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchParamsDto)
  public params: SpaRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchFilesDto)
  public files: SpaRessourcePatchFilesDto

  public get after () {
    return new SpaRessourcePatchDtoAfter(this)
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

export class SpaRessourcePatchBodyDtoAfter implements AsSameProperties<SpaRessourcePatchBodyDto> {
  public title?: string
  public description?: string
  public spaImages?: SpaImages[]
  public location?: string
  public google_maps_link?: string
}

export class SpaRessourcePatchQueryDtoAfter
implements AsSameProperties<SpaRessourcePatchQueryDto> {}

export class SpaRessourcePatchParamsDtoAfter
implements AsSameProperties<SpaRessourcePatchParamsDto> {
  @Transform(({ value }) => Spa.findOrFail(value))
  @AwaitPromise
  public id: Spa
}

@Exclude()
export class SpaRessourcePatchFilesDtoAfter
implements AsSameProperties<SpaRessourcePatchFilesDto> {}

@SkipTransform([['files', SpaRessourcePatchFilesDtoAfter]])
export class SpaRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchBodyDtoAfter)
  public body: SpaRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchQueryDtoAfter)
  public query: SpaRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchParamsDtoAfter)
  public params: SpaRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaRessourcePatchFilesDtoAfter)
  public files: SpaRessourcePatchFilesDtoAfter
}
