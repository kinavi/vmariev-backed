import { guid } from '../../../common/functions/guid';

require('dotenv').config();

export const CREATE_ORDER_TYPE_BODY_DATA = {
  label: guid(),
  isActive: false,
  fileId: null,
};

export const UPDATE_ORDER_TYPE_BODY_DATA = {
  label: guid(),
  isActive: true,
  fileId: null,
};

export const CREATE_SUBJECT_BODY_DATA = {
  label: guid(),
  isActive: false,
  fileId: null,
};

export const UPDATE_SUBJECT_BODY_DATA = {
  label: guid(),
  isActive: true,
  fileId: null,
};

export const AUTH_ADMIN_TEST = process.env.AUTH_ADMIN_TEST;
export const AUTH_CUSTOMER_TESTS = process.env.AUTH_CUSTOMER_TESTS;
