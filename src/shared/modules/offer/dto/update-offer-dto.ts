import { HousingType } from '../../../../const.js';
import { CityName, Location } from '../../../types/index.js';

export class UpdateOfferDto {
  public title: string;
  public description: string;
  public publishDate: Date;
  public city: CityName;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: HousingType;
  public rooms: number;
  public guests: number;
  public price: number;
  public amenities: string[];
  public author: string;
  public commentsCount: number;
  public coordinates: Location;
}
