import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { UpdateOfferDto } from './dto/update-offer-dto.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_SORTED_OFFER_COUNT } from './offer.constant.js';
import { PreviewOfferRto } from './rto/preview-offer-rto.js';
import { plainToInstance } from 'class-transformer';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['author'])
      .exec();
  }

  public async find(amount?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = amount ?? DEFAULT_OFFER_COUNT;

    return this.offerModel
      .find()
      .limit(limit)
      .populate(['author'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['author'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async findPreviews(amount?: number): Promise<PreviewOfferRto[]> {
    const limit = amount ?? DEFAULT_OFFER_COUNT;
    const offers = await this.offerModel
      .find()
      .limit(limit)
      .populate(['author'])
      .exec();

    return plainToInstance(PreviewOfferRto, offers.map((offer) => offer.toObject()), {
      excludeExtraneousValues: true,
    });
  }

  public async findPremium(amount: number): Promise<PreviewOfferRto[]> {
    const limit = amount ?? DEFAULT_SORTED_OFFER_COUNT;
    const offers = await this.offerModel
      .find({isPremium: true})
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate(['author'])
      .exec();

    return plainToInstance(PreviewOfferRto, offers.map((offer) => offer.toObject()), {
      excludeExtraneousValues: true,
    });
  }

  public async findFavorites(userId: string): Promise<PreviewOfferRto[]> {
    const offers = await this.offerModel
      .find({isFavorite: true, author: userId})
      .populate(['author'])
      .exec();

    return plainToInstance(PreviewOfferRto, offers.map((offer) => offer.toObject()), {
      excludeExtraneousValues: true,
    });
  }

  public async setFavoriteStatus(
    userId: string,
    offerId: string,
    isFavorite: boolean
  ): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      this.logger.warn(`Offer with id ${offerId} not found.`);
      return null;
    }

    if (offer.author.toString() !== userId) {
      this.logger.warn(`User ${userId} tried to modify favorite status of an unauthorized offer.`);
      return null;
    }

    offer.isFavorite = isFavorite;
    await offer.save();

    this.logger.info(`Offer ${offerId} favorite status set to ${isFavorite} by user ${userId}.`);
    return offer;
  }
}

