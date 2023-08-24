import Joi from 'joi';
export const animal_types = ['Reh', 'Wildschwein'];
export const meat_types = ['Rücken', 'Keule', 'Für Wurst'];
export const drawer_numbers = ['Nicht zugewiesen', 1, 2, 3, 4, 5, 6];

const vensionSchema: Record<string, any> = {
  drawer_number: Joi.alternatives()
    .try(Joi.number().integer().min(0), Joi.string().allow('Nicht Zugewiesen'))
    .required()
    .messages({
      'any.required': 'Bitte gib eine Schubladennummer an.',
      'alternatives.types': 'Bitte gib eine Schubladennummer an.',
    }),
  animal_type: Joi.string()
    .allow(...animal_types)
    .required()
    .messages({
      'strin.base': 'Bitte gib eine Tierart an.',
      'string.empty': 'Bitte gib eine Tierart an.',
      'string.allowOnly': 'Bitte gib eine Tierart an.',
      'any.required': 'Bitte gib eine Tierart an.',
    }),
  meat_type: Joi.string()
    .allow(...meat_types)
    .required()
    .messages({
      'strin.base': 'Bitte gib eine Fleischart an.',
      'string.empty': 'Bitte gib eine Fleischart an.',
      'string.allowOnly': 'Bitte gib eine Fleischart an.',
      'any.required': 'Bitte gib eine Fleischart an.',
    }),
  weight: Joi.number().min(0).required().messages({
    'number.base': 'Bitte gib ein Gewicht an.',
    'number.empty': 'Bitte gib ein Gewicht an.',
    'number.min': 'Das Gewicht muss größer als 0 sein.',
    'any.required': 'Bitte gib ein Gewicht an.',
  }),
  count: Joi.number().integer().min(0).required().messages({
    'number.base': 'Bitte gib ein Gewicht an.',
    'number.empty': 'Bitte gib ein Gewicht an.',
    'number.min': 'Die Zahl muss größer als 0 sein.',
    'number.integer': 'Bitte gib eine ganze Zahl an.',
    'any.required': 'Bitte gib ein Gewicht an.',
  }),
  date: Joi.date().iso().required().messages({
    'date.base': 'Bitte gib ein gültiges Datum im ISO Format an.',
    'date.iso': 'Bitte gib ein gültiges Datum im ISO Format an.',
    'any.required': 'Bitte gib ein Datum an.',
  }),
  reserved_for: Joi.string().max(255).allow(null, '').messages({
    'string.base': 'Bitte gib nur Buchstaben an.',
    'string.max': 'Bitte gib maximal 255 Buchstaben an.',
  }),
};

const priceSchema: Record<string, any> = {
  animal_type: Joi.string()
    .allow(...animal_types)
    .required()
    .messages({
      'strin.base': 'Bitte gib eine Tierart an.',
      'string.empty': 'Bitte gib eine Tierart an.',
      'string.allowOnly': 'Bitte gib eine Tierart an.',
      'any.required': 'Bitte gib eine Tierart an.',
    }),
  meat_type: Joi.string()
    .allow(...meat_types)
    .required()
    .messages({
      'strin.base': 'Bitte gib eine Fleischart an.',
      'string.empty': 'Bitte gib eine Fleischart an.',
      'string.allowOnly': 'Bitte gib eine Fleischart an.',
      'any.required': 'Bitte gib eine Fleischart an.',
    }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Bitte gib einen Preis an.',
    'number.empty': 'Bitte gib einen Preis an.',
    'number.min': 'Der Preis muss größer als 0 sein.',
    'any.required': 'Bitte gib einen Preis an.',
  }),
};

export const validateVension = (values: Record<string, any>) => {
  const errors: Record<string, any> = {};
  for (const key in values) {
    if (!vensionSchema[key]) continue;
    const { error } = vensionSchema[key].validate(values[key]);
    if (error) {
      errors[key] = error.message;
    }
  }
  return errors;
};

export const validatePrice = (values: Record<string, any>) => {
  const errors: Record<string, any> = {};
  for (const key in values) {
    if (!priceSchema[key]) continue;
    const { error } = priceSchema[key].validate(values[key]);
    if (error) {
      errors[key] = error.message;
    }
  }

  // check if combination of animal_type and meat_type already exists

  return errors;
};
