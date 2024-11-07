import Joi from 'joi';

type Schema = Record<string, any>;

const vensionSchema: Record<string, any> = {
  drawerNumber: Joi.alternatives()
    .try(Joi.number().integer().min(0), Joi.string().allow('Nicht Zugewiesen'))
    .required()
    .messages({
      'any.required': 'Bitte gib eine Schubladennummer an.',
      'alternatives.types': 'Bitte gib eine Schubladennummer an.',
    }),
  animal: Joi.string().required().messages({
    'strin.base': 'Bitte gib eine Tierart an.',
    'string.empty': 'Bitte gib eine Tierart an.',
    'string.allowOnly': 'Bitte gib eine Tierart an.',
    'any.required': 'Bitte gib eine Tierart an.',
  }),
  animalPart: Joi.string().required().messages({
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
    'number.base': 'Bitte gib ein Anzahl an.',
    'number.empty': 'Bitte gib ein Anzahl an.',
    'number.min': 'Die Zahl muss größer als 0 sein.',
    'number.integer': 'Bitte gib eine ganze Anzahl an.',
    'any.required': 'Bitte gib ein Anzahl an.',
  }),
  date: Joi.date().iso().required().messages({
    'date.base': 'Bitte gib ein gültiges Datum im ISO Format an.',
    'date.iso': 'Bitte gib ein gültiges Datum im ISO Format an.',
    'any.required': 'Bitte gib ein Datum an.',
  }),
  reservedFor: Joi.string().max(255).allow(null, '').messages({
    'string.base': 'Bitte gib nur Buchstaben an.',
    'string.max': 'Bitte gib maximal 255 Buchstaben an.',
  }),
};

const priceSchema: Record<string, any> = {
  animal: Joi.string().required().messages({
    'strin.base': 'Bitte gib eine Tierart an.',
    'string.empty': 'Bitte gib eine Tierart an.',
    'any.required': 'Bitte gib eine Tierart an.',
  }),
  animalPart: Joi.string().required().messages({
    'strin.base': 'Bitte gib eine Fleischart an.',
    'string.empty': 'Bitte gib eine Fleischart an.',
    'any.required': 'Bitte gib eine Fleischart an.',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Bitte gib einen Preis an.',
    'number.empty': 'Bitte gib einen Preis an.',
    'number.min': 'Der Preis muss größer als 0 sein.',
    'any.required': 'Bitte gib einen Preis an.',
  }),
};

const freezerSchema: Record<string, any> = {
  name: Joi.string().required().messages({
    'strin.base': 'Bitte gib eine Namen an.',
    'string.empty': 'Bitte gib eine Namen an.',
    'any.required': 'Bitte gib eine Namen an.',
  }),
  drawerCount: Joi.number().min(1).max(20).required().messages({
    'number.base': 'Bitte gib einen Anzahl an.',
    'number.empty': 'Bitte gib eine Anzahl an.',
    'number.min': 'Die Anzahl muss größer als 0 sein.',
    'number.max': 'Die Anzahl muss kleiner als 20 sein.',
    'any.required': 'Bitte gib eine Anzahl an.',
  }),
};

const validateValues = (values: Record<string, any>, schema: Schema) => {
  const errors: Record<string, any> = {};
  for (const key in values) {
    if (!schema[key]) continue;
    const { error } = schema[key].validate(values[key]);
    if (error) {
      errors[key] = error.message;
    }
  }
  return errors;
};

export const validateVension = (values: Record<string, any>) => {
  return validateValues(values, vensionSchema);
};

export const validatePrice = (values: Record<string, any>) => {
  const errors = validateValues(values, priceSchema);

  // check if combination of animal_type and meat_type already exists

  return errors;
};

export const validateFreezer = (values: Record<string, any>) => {
  const errors = validateValues(values, freezerSchema);
  console.log(errors);
  return errors;
};
