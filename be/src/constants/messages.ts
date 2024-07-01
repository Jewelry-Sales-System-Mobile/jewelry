export const USERS_MESSAGES = {
  VALIDATION_ERROR: "Validation Error",
  USER_NOT_FOUND: "User not found",
  EMAIL_OR_PASSWORD_INCORRECT: "Email or password is incorrect",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  EMAIL_IS_REQUIRED: "Email is required",
  EMAIL_INVALID: "Email is invalid",
  NAME_IS_REQUIRED: "Name is required",
  NAME_MUST_BE_STRING: "Name must be a string",
  NAME_LENGTH: "Name must be between 1 and 100 characters",
  PASSWORD_IS_REQUIRED: "Password is required",
  PASSWORD_LENGTH: "Password must be between 6 and 50 characters",
  PASSWORD_MUST_BE_STRING: "Password must be a string",
  PASSWORD_MUST_BE_STRONG:
    "Password must be at least 6 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol",
  CONFIRM_PASSWORD_IS_REQUIRED: "Confirm password is required",
  CONFIRM_PASSWORD_LENGTH:
    "Confirm password must be between 6 and 50 characters",
  CONFIRM_PASSWORD_MUST_BE_STRING: "Confirm password must be a string",
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    "Confirm password must be at least 6 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol",
  CONFIRM_PASSWORD_NOT_MATCH: "Confirm password does not match",
  DATE_OF_BIRTH_MUST_BE_ISO8061: "Date of birth must be in ISO8061 format",
  LOGIN_SUCCESS: "Login success",
  REGISTER_SUCCESS: "Register success",
  ACCESS_TOKEN_EXPIRED: "Access token expired",
  ACCESS_TOKEN_IS_REQUIRED: "Access token is required",
  REFRESH_TOKEN_IS_REQUIRED: "Refresh token is required",
  REFRESH_TOKEN_INVALID: "Refresh token is invalid",
  REFRESH_TOKEN_IS_USED_OR_NOT_EXIST: "Refresh token is used or not exist",
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: "Email verify token is required",
  LOGOUT_SUCCESS: "Logout success",
  EMAIL_IS_VERIFIED_BEFORE: "Email is verified before",
  EMAIL_VERIFY_SUCCESS: "Email verify success",
  RESEND_EMAIL_VERIFY_SUCCESS: "Resend email verify success",
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: "Forgot password token is required",
  FORGOT_PASSWORD_VERIFY_SUCCESS: "Forgot password verify success",
  FORGOT_PASSWORD_TOKEN_IS_INVALID: "Forgot password token is invalid",
  USERNAME_MUST_BE_STRING: "Username must be a string",
  USERNAME_INVALID: "Username is invalid",
  USERNAME_EXISTED: "Username is existed",
  IMAGE_URL_MUST_BE_STRING: "Image url must be a string",
  IMAGE_URL_LENGTH: "Image url must be between 1 and 400 characters",
  INVALID_FOLLOW_USER_ID: "Invalid follow user id",
  CHANGE_PASSWORD_SUCCESS: "Change password success",
  RESET_PASSWORD_SUCCESS: "Reset password success",
  GET_MY_PROFILE_SUCCESS: "Get my profile success",
  UPDATE_PROFILE_SUCCESS: "Update profile success",
  GET_USER_PROFILE_SUCCESS: "Get user profile success",
  USER_NOT_VERIFIED: "User not verified",
  OLD_PASSWORD_INCORRECT: "Old password is incorrect",
  LOCATION_MUST_BE_STRING: "Location must be a string",
  LOCATION_LENGTH: "Location must be between 1 and 200 characters",
  ADD_ADDRESS_SUCCESS: "Add address success",
  PHONENUMBER_MUST_BE_STRING: "Phone number must be a string",
  PHONENUMBER_INVALID:
    "Phone number must be 10 digits, start with 0 and second digit is 3, 5, 7, 8, 9",
  ADDRESS_IS_REQUIRED: "Address is required",
  PHONENUMBER_IS_REQUIRED: "Phone number is required",
  UPDATE_ADDRESS_SUCCESS: "Update address success",
  ADDRESS_NOT_FOUND: "Address not found",
  DELETE_ADDRESS_SUCCESS: "Delete address success",
  GET_MY_ADDRESS_SUCCESS: "Get address success",
  YOU_DONT_HAVE_PERMISSION:
    "You don't have permission to do this action. Just admin can do this",
} as const;

export const COLLECTIONS_MESSAGES = {
  ADD_COLLECTION_SUCCESS: "Add collection success",
  COLLECTION_IS_EXISTED: "Collection is existed",
  GET_ALL_COLLECTIONS_SUCCESS: "Get all collections success",
  STATUS_MUST_BE_NUMBER: "Status must be a number",
  UPDATE_COLLECTION_SUCCESS: "Update Collection Success",
  COLLECTION_NOT_FOUND: "Collection not found",
  DELETE_COLLECTION_SUCCESS: "Delete collection success",
} as const;

export const PRODUCTS_MESSAGES = {
  PRODUCT_NOT_FOUND: "Product not found",
  ADD_IMAGE_TO_PRODUCT_SUCCESS: "Add image to product success",
  DELETE_IMAGE_SUCCESSFULLY: "Delete image successfully",
};
