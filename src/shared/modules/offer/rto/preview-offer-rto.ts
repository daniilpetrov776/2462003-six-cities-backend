import { HousingType } from '../../../../const.js';
import { CityName } from '../../../types/index.js';

import { Expose } from 'class-transformer';


export class PreviewOfferRto {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public price!: number;

  @Expose()
  public housingType!: HousingType;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public city!: CityName;

  @Expose()
  public previewImage!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;
}
