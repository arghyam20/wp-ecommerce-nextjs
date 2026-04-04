import Joi from 'joi';

export const validate = <T>(
  schema: Joi.ObjectSchema,
  data: T
): { error?: Record<string, string>; value: T } => {
  const result = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (result.error) {
    const errors = result.error.details.reduce((acc: Record<string, string>, curr) => {
      acc[String(curr.path[0])] = curr.message;
      return acc;
    }, {});
    return { error: errors, value: result.value };
  }
  return { value: result.value };
};

export const validateAsync = async <T>(schema: Joi.ObjectSchema, data: T): Promise<T> => {
  try {
    return await schema.validateAsync(data, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      const errors = error.details.reduce((acc: Record<string, string>, curr) => {
        acc[String(curr.path[0])] = curr.message;
        return acc;
      }, {});
      throw errors;
    }
    throw error;
  }
};
