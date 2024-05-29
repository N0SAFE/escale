import { IsDefined, IsNumberString, IsObject, ValidateNested } from 'class-validator'
import { BaseDto } from '../BaseDto'
import { Transform, Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class ImageRessourceAttachementBodyDto {}

export class ImageRessourceAttachementQueryDto {
  @IsDefined()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value))
  public id: number
}

export class ImageRessourceAttachementFilesDto {}

export class ImageRessourceAttachementDto extends BaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceAttachementBodyDto)
  public body: ImageRessourceAttachementBodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceAttachementQueryDto)
  public query: ImageRessourceAttachementQueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceAttachementFilesDto)
  public _images: ImageRessourceAttachementFilesDto

  public get after() {
    return new ImageRessourceAttachementDtoAfter(this)
  }

  public static fromRequest(request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), _images: request.allFiles() })
  }
}

export class ImageRessourceAttachementBodyDtoAfter
  implements AsSameProperties<ImageRessourceAttachementBodyDto> {}

export class ImageRessourceAttachementQueryDtoAfter
  implements AsSameProperties<ImageRessourceAttachementQueryDto>
{
  public id: number
}

export class ImageRessourceAttachementFilesDtoAfter
  implements AsSameProperties<ImageRessourceAttachementFilesDto> {}

export class ImageRessourceAttachementDtoAfter
  extends BaseDto
  implements AsSameProperties<Omit<ImageRessourceAttachementDto, 'after'>>
{
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceAttachementBodyDtoAfter)
  public body: ImageRessourceAttachementBodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceAttachementQueryDtoAfter)
  public query: ImageRessourceAttachementQueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageRessourceAttachementFilesDtoAfter)
  public _images: ImageRessourceAttachementFilesDtoAfter
}
