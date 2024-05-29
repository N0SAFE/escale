import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { AwaitPromise } from '../Decorator/AwaitPromise'
import Service from 'App/Models/Service'
import { EntityExist } from '../Decorator/EntityExist'

export class ServiceRessourceDeleteBodyDto {}

export class ServiceRessourceDeleteQueryDto {}

export class ServiceRessourceDeleteParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Service)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class ServiceRessourceDeleteFilesDto {}

@SkipTransform([['files', ServiceRessourceDeleteFilesDto]])
export class ServiceRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteBodyDto)
  public body: ServiceRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteQueryDto)
  public query: ServiceRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteParamsDto)
  public params: ServiceRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteFilesDto)
  public files: ServiceRessourceDeleteFilesDto

  public get after() {
    return new ServiceRessourceDeleteDtoAfter(this)
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

export class ServiceRessourceDeleteBodyDtoAfter
  implements AsSameProperties<ServiceRessourceDeleteBodyDto> {}

export class ServiceRessourceDeleteQueryDtoAfter
  implements AsSameProperties<ServiceRessourceDeleteQueryDto> {}

export class ServiceRessourceDeleteParamsDtoAfter
  implements AsSameProperties<ServiceRessourceDeleteParamsDto>
{
  @Transform(({ value }) => Service.findOrFail(value))
  @AwaitPromise
  public id: Service
}

@Exclude()
export class ServiceRessourceDeleteFilesDtoAfter
  implements AsSameProperties<ServiceRessourceDeleteFilesDto> {}

@SkipTransform([['files', ServiceRessourceDeleteFilesDtoAfter]])
export class ServiceRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ServiceRessourceDeleteDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteBodyDtoAfter)
  public body: ServiceRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteQueryDtoAfter)
  public query: ServiceRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteParamsDtoAfter)
  public params: ServiceRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceRessourceDeleteFilesDtoAfter)
  public files: ServiceRessourceDeleteFilesDtoAfter
}
