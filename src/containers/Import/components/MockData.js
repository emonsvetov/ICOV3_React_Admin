
export const IMPORT_DATA = [
  {
    id: 1,
    name: 'test_file_01.csv',
    date: '09/28/2021 17:24:47',
    size: 123,
    rows: 12,
    type: 'add_participants',
    errors: [],
  },
  {
    id: 2,
    name: 'test_file_02.csv',
    date: '07/18/2021 16:24:47',
    size: 467,
    rows: 256,
    type: 'add_participants',
    errors: [
      {
        row: 1,
        error: 'The email already been taken'
      },
      {
        row: 2,
        error: 'The email already been taken'
      }
    ],
  },
  {
    id: 3,
    name: 'test_file_03.csv',
    date: '05/21/2021 15:24:47',
    size: 432,
    rows: 11,
    type: 'add_participants',
    errors: [],
  },
  {
    id: 4,
    name: 'test_file_04.csv',
    date: '01/26/2021 15:24:47',
    size: 16,
    rows: 3,
    type: 'add_managers',
    errors: [],
  },
];