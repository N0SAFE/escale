import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../BaseDto'
import { SkipTransform } from '../Decorator/SkipTransform'
import { EntityExist } from '../Decorator/EntityExist'
import Availability from 'App/Models/Availability'
import { AwaitPromise } from '../Decorator/AwaitPromise'

export class AvailabilityRessourceDeleteBodyDto {}

export class AvailabilityRessourceDeleteQueryDto {}

export class AvailabilityRessourceDeleteParamsDto {
  @IsDefined()
  @IsNumber()
  @EntityExist(Availability)
  @Type(() => Number)
  public id: number
}

@Exclude()
export class AvailabilityRessourceDeleteFilesDto {}

@SkipTransform([['files', AvailabilityRessourceDeleteFilesDto]])
export class AvailabilityRessourceDeleteDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteBodyDto)
  public body: AvailabilityRessourceDeleteBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteQueryDto)
  public query: AvailabilityRessourceDeleteQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteParamsDto)
  public params: AvailabilityRessourceDeleteParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteFilesDto)
  public files: AvailabilityRessourceDeleteFilesDto

  public get after () {
    return new AvailabilityRessourceDeleteDtoAfter(this)
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

export class AvailabilityRessourceDeleteBodyDtoAfter
implements AsSameProperties<AvailabilityRessourceDeleteBodyDto> {}

export class AvailabilityRessourceDeleteQueryDtoAfter
implements AsSameProperties<AvailabilityRessourceDeleteQueryDto> {}

export class AvailabilityRessourceDeleteParamsDtoAfter
implements AsSameProperties<AvailabilityRessourceDeleteParamsDto> {
  @Transform(({ value }) => Availability.findOrFail(value))
  @AwaitPromise
  public id: Availability
}

@Exclude()
export class AvailabilityRessourceDeleteFilesDtoAfter
implements AsSameProperties<AvailabilityRessourceDeleteFilesDto> {}

@SkipTransform([['files', AvailabilityRessourceDeleteFilesDtoAfter]])
export class AvailabilityRessourceDeleteDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<AvailabilityRessourceDeleteDto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteBodyDtoAfter)
  public body: AvailabilityRessourceDeleteBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteQueryDtoAfter)
  public query: AvailabilityRessourceDeleteQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteParamsDtoAfter)
  public params: AvailabilityRessourceDeleteParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityRessourceDeleteFilesDtoAfter)
  public files: AvailabilityRessourceDeleteFilesDtoAfter
}
