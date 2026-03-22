import Joi from 'joi';

export const checkoutSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
  }),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(15).required().messages({
    'string.pattern.base': 'Please enter a valid phone number',
    'string.empty': 'Phone number is required',
  }),
  address: Joi.string().min(5).max(100).required().messages({
    'string.empty': 'Address is required',
    'string.min': 'Please enter a valid address',
  }),
  city: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'City is required',
  }),
  state: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'State is required',
  }),
  postcode: Joi.string().pattern(/^[0-9]{5,6}$/).required().messages({
    'string.pattern.base': 'Please enter a valid postal code',
    'string.empty': 'Postal code is required',
  }),
  country: Joi.string().length(2).required().messages({
    'string.length': 'Please select a country',
    'string.empty': 'Country is required',
  }),
  paymentMethod: Joi.string().valid('cod', 'bank_transfer', 'card').required().messages({
    'any.only': 'Please select a valid payment method',
    'string.empty': 'Payment method is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Please confirm your password',
  }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters',
    'string.empty': 'New password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Please confirm your new password',
  }),
});

export const profileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required',
  }),
});