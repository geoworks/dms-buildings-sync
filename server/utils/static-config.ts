import { getDmsName } from './../deql-ms-server/tools/utils';
const defaultRoles = ['system'];

export default {
  serviceTypeName: 'template' + getDmsName(),
  serviceDescription: 'Шаблон',
  schemaRules: {
    some_rule: {
      access: {
        displayName: 'Доступ к сервису',
        defaultRoles: defaultRoles,
      },
    },
  },
};
