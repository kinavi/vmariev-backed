import Offer from './offer';
import Order from './order';
import Review from './review';
import User from './user';

Order.belongsTo(User, {
  as: 'customer',
  foreignKey: {
    name: 'customerId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

Order.belongsTo(User, {
  as: 'executor',
  foreignKey: {
    name: 'executorId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

//review
Review.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

export { Offer, Order, Review, User };
