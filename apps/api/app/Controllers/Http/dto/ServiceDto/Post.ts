import { IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Image from 'App/Models/Image'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class ServiceRessourcePostBodyDto {
  @IsDefined()
  @IsString()
  public label: string

  @IsDefined()
  @IsString()
  public description: string

  @IsDefined()
  @IsNumber()
  @EntityExist(Image)
  public image: number
}

export class ServiceRessourcePostQueryDto {}

export class ServiceRessourcePostParamsDto {}

@Exclude()
export class ServiceRessourcePostFilesDto {}

@SkipTransform([['files', ServiceRessourcePostFilesDto]])
export class ServiceRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostBodyDto)
  public body: ServiceRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostQueryDto)
  public query: ServiceRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostParamsDto)
  public params: ServiceRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostFilesDto)
  public files: ServiceRessourcePostFilesDto

  public get after () {
    return new ServiceRessourcePostDtoAfter(this)
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

export class ServiceRessourcePostBodyDtoAfter
implements AsSameProperties<ServiceRessourcePostBodyDto> {
  public label: string
  public description: string

  @Transform(({ value }) => Image.findOrFail(value))
  @AwaitPromise
  public image: Image
}

export class ServiceRessourcePostQueryDtoAfter
implements AsSameProperties<ServiceRessourcePostQueryDto> {}

export class ServiceRessourcePostParamsDtoAfter
implements AsSameProperties<ServiceRessourcePostParamsDto> {}

@Exclude()
export class ServiceRessourcePostFilesDtoAfter
implements AsSameProperties<ServiceRessourcePostFilesDto> {}

@SkipTransform([['files', ServiceRessourcePostFilesDtoAfter]])
export class ServiceRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ServiceRessourcePostDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostBodyDtoAfter)
  public body: ServiceRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostQueryDtoAfter)
  public query: ServiceRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostParamsDtoAfter)
  public params: ServiceRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourcePostFilesDtoAfter)
  public files: ServiceRessourcePostFilesDtoAfter
}
