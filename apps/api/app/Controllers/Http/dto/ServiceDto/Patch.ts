import { IsDefined, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Service from 'App/Models/Service'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import Image from 'App/Models/Image'

export class ServiceRessourcePatchBodyDto {
  @IsOptional()
  public label?: string

  @IsOptional()
  public description?: string

  @IsOptional()
  @EntityExist(Image, {
    nullable: true,
  })
  public image?: number | null
}

export class ServiceRessourcePatchQueryDto {}

export class ServiceRessourcePatchParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Service)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class ServiceRessourcePatchFilesDto {}

@SkipTransform([['files', ServiceRessourcePatchFilesDto]])
export class ServiceRessourcePatchDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchBodyDto)
  public body: ServiceRessourcePatchBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchQueryDto)
  public query: ServiceRessourcePatchQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchParamsDto)
  public params: ServiceRessourcePatchParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchFilesDto)
  public files: ServiceRessourcePatchFilesDto

  public get after () {
    return new ServiceRessourcePatchDtoAfter(this)
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

export class ServiceRessourcePatchBodyDtoAfter
implements AsSameProperties<ServiceRessourcePatchBodyDto> {
  public label?: string
  public description?: string
  public image?: number | null
}

export class ServiceRessourcePatchQueryDtoAfter
implements AsSameProperties<ServiceRessourcePatchQueryDto> {}

export class ServiceRessourcePatchParamsDtoAfter
implements AsSameProperties<ServiceRessourcePatchParamsDto> {
  @Transform(({ value }) => Service.findOrFail(value))
  @AwaitPromise
  public id: Service
}

@Exclude()
export class ServiceRessourcePatchFilesDtoAfter
implements AsSameProperties<ServiceRessourcePatchFilesDto> {}

@SkipTransform([['files', ServiceRessourcePatchFilesDtoAfter]])
export class ServiceRessourcePatchDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ServiceRessourcePatchDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchBodyDtoAfter)
  public body: ServiceRessourcePatchBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchQueryDtoAfter)
  public query: ServiceRessourcePatchQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchParamsDtoAfter)
  public params: ServiceRessourcePatchParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePatchFilesDtoAfter)
  public files: ServiceRessourcePatchFilesDtoAfter
}
