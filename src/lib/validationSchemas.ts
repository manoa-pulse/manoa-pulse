import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const UpdateStuffSchema = Yup.object({
  location: Yup.string().oneOf([
    'HamiltonLibrary',
    'WarriorRecreationCenter',
    'CampusCenterFoodCourt',
    'CampusCenterOutdoorCourt',
    'TacoBellFoodCourt',
    'ParadisePalms',
    'POST2ndFloor',
  ]).required(),

  busyLevel: Yup.number()
    .required('Busy level is required')
    .min(1, 'Minimum is 1')
    .max(10, 'Maximum is 10')
    .integer('Must be a whole number'),

  comment: Yup.string().optional().default(''),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});
