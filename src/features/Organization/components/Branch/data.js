export const columns = [
  {
    accessorKey: 'nameAr',
    header: 'Arabic Name'
  },
  {
    accessorKey: 'nameEn',
    header: 'English Name'
  }
];

export const Data = [
  {
    id: '1',
    nameAr: 'nameAr',
    nameEn: 'Arabic Name'
  },
  {
    id: '2',
    nameAr: 'nameEn',
    nameEn: 'English Name'
  }
];

export const dynamicForm = {
  firstName: {
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter your first name',
    defaultValue: '',
    rules: {
      required: true
    }
  },
  lastName: {
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter your last name',
    defaultValue: '',
    rules: {
      required: true
    }
  },
  gender: {
    label: 'Gender',
    type: 'radio',
    options: ['male', 'female'],
    defaultValue: '',
    rules: {
      required: true
    }
  },
  profession: {
    label: 'Profession',
    type: 'dropdown',
    options: ['Front-end Developer', 'Back-end Developer', 'Devops Engineer'],
    defaultValue: '',
    rules: {
      required: true
    }
  },
  agree: {
    type: 'checkbox',
    label: '',
    checkboxLabel: 'I hereby agree to the terms.',
    defaultValue: false,
    rules: {
      required: true
    }
  }
};
