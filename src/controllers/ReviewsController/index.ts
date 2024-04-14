import { Review } from '../../database/models';
import { IReviewAttributes } from '../../database/models/review';
import { REVIEWS_INCLUDES } from './constants';

export class ReviewsController {
  get = async (id: number, is_public = true) => {
    const result = await Review.findOne({
      where: { id },
      include: REVIEWS_INCLUDES,
    });
    return result?.toJSON();
  };

  create = async (review: IReviewAttributes) => {
    const result = await Review.create(review);
    return this.get(result.id);
  };

  getOnlyActive = async (is_public = true) => {
    const result = await Review.findAll({
      where: { isActive: true },
      include: REVIEWS_INCLUDES,
    });
    return result.map((item) => item.toJSON());
  };

  getAll = async (is_public = true) => {
    const result = await Review.findAll({
      include: REVIEWS_INCLUDES,
    });
    return result.map((item) => item.toJSON());
  };

  update = async (
    id: number,
    data: Pick<IReviewAttributes, 'login' | 'text' | 'isActive' | 'userId'>
  ) => {
    await Review.update(data, { where: { id } });
    return this.get(id);
  };

  remove = async (id: number) => {
    const result = await Review.destroy({ where: { id } });
    return !!result;
  };
}
