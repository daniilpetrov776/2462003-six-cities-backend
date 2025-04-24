import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDto } from './dto/create-offer-dto.js';
import { UpdateOfferDto } from './dto/update-offer-dto.js';
import { PreviewOfferRto } from './rto/preview-offer-rto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(amount?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPreviews(amount?: number): Promise<PreviewOfferRto[]>;
  findPremium(amount?: number): Promise<PreviewOfferRto[]>;
  findFavorites(userId: string): Promise<PreviewOfferRto[]>;
  setFavoriteStatus(userId: string, offerId: string, isFavorite: boolean): Promise<DocumentType<OfferEntity> | null>;
}
