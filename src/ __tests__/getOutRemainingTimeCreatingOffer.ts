import { Offer } from '../database/models';

require('dotenv').config({ path: '.env.test' });

export function getOutRemainingTimeCreatingOffer(offer: Offer) {
  const createTime = offer?.createdAt.getTime() || 0;
  const currentTime = new Date().getTime();
  const blockLimitTime =
    (Number(process.env.TIME_FOR_RECREATING_OFFER_SECOMDS) || 0) * 1000;
  const deltaTime =
    currentTime - createTime - blockLimitTime >= 0
      ? 0
      : Math.abs(currentTime - createTime - blockLimitTime);
  return deltaTime;
}
