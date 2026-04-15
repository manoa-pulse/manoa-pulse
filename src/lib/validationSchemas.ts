import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const UpdateStuffSchema = Yup.object({
  location: Yup.string().oneOf([
    'Keller',
    'Art',
    'Kuykendall',
    'Bilger',
    'CampusCenter',
    'Moore',
    'ParadisePalms',
    'POST'
  ]).required(),
  busyLevel: Yup.number().positive().required(),
  comment: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});
