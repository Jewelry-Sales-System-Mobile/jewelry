import collectionsService from "~/services/collections.services";
import { checkSchema, ParamSchema } from "express-validator";
import { validate } from "./../utils/validation";
import { COLLECTIONS_MESSAGES, USERS_MESSAGES } from "~/constants/messages";

const nameSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING,
  },
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
  },
  isLength: {
    options: {
      min: 1,
      max: 100,
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH,
  },
};
export const addNewCollectionValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        custom: {
          options: async (value) => {
            const isExist =
              await collectionsService.checkCollectionExisted(value);
            if (isExist) {
              throw new Error(COLLECTIONS_MESSAGES.COLLECTION_IS_EXISTED);
            }
            return true;
          },
        },
      },
    },
    ["body"]
  )
);

export const updateCollectionValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        notEmpty: undefined,
        optional: true,
      },
      status: {
        isNumeric: {
          errorMessage: COLLECTIONS_MESSAGES.STATUS_MUST_BE_NUMBER,
        },
        optional: true,
      },
    },
    ["body"]
  )
);
