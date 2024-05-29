import { IsDefined, IsNumber, IsObject, ValidateNested } from 'class-validator'
import { Exclude, Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { BaseDto } from '../../BaseDto'
import { SkipTransform } from '../../Decorator/SkipTransform'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { ValidateFile } from '../../Decorator/ValidateFile'
import { EntityExist } from '../../Decorator/EntityExist'
import Spa from 'App/Models/Spa'
import { AwaitPromise } from '../../Decorator/AwaitPromise'

export class SpaImageRessourcePostBodyDto {}

export class SpaImageRessourcePostQueryDto {}

export class SpaImageRessourcePostParamsDto {
  @IsDefined()
  @EntityExist(Spa)
  @IsNumber()
  @Type(() => Number)
  public spa: number
}

@Exclude()
export class SpaImageRessourcePostFilesDto {
  @IsDefined()
  @IsObject({ each: true })
  @ValidateFile(
    {
      extnames: ['jpg', 'jpeg', 'png'],
      maxSize: '2mb',
    },
    { each: true }
  )
  public images: MultipartFileContract[]
}

@SkipTransform([['files', SpaImageRessourcePostFilesDto]])
export class SpaImageRessourcePostDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostBodyDto)
  public body: SpaImageRessourcePostBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostQueryDto)
  public query: SpaImageRessourcePostQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostParamsDto)
  public params: SpaImageRessourcePostParamsDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostFilesDto)
  public files: SpaImageRessourcePostFilesDto

  public get after() {
    return new SpaImageRessourcePostDtoAfter(this)
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

export class SpaImageRessourcePostBodyDtoAfter
  implements AsSameProperties<SpaImageRessourcePostBodyDto> {}

export class SpaImageRessourcePostQueryDtoAfter
  implements AsSameProperties<SpaImageRessourcePostQueryDto> {}

export class SpaImageRessourcePostParamsDtoAfter
  implements AsSameProperties<SpaImageRessourcePostParamsDto>
{
  @Transform(async ({ value }) => await Spa.findOrFail(value))
  @AwaitPromise
  public spa: Spa
}

@Exclude()
export class SpaImageRessourcePostFilesDtoAfter
  implements AsSameProperties<SpaImageRessourcePostFilesDto>
{
  public images: MultipartFileContract[]
}

@SkipTransform([['files', SpaImageRessourcePostFilesDtoAfter]])
export class SpaImageRessourcePostDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<SpaImageRessourcePostDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostBodyDtoAfter)
  public body: SpaImageRessourcePostBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostQueryDtoAfter)
  public query: SpaImageRessourcePostQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostParamsDtoAfter)
  public params: SpaImageRessourcePostParamsDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SpaImageRessourcePostFilesDtoAfter)
  public files: SpaImageRessourcePostFilesDtoAfter
}
