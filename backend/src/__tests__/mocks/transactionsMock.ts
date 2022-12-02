export const transactionsListMock = [
  {
    id: 1,
    value: 21.07,
    createdAt: '2022-12-02',
    ownerAccount: {
      id: 2,
      user: { name: 'Sebastian' },
    },
    receiverAccount: {
      id: 1,
      user: { name: 'Mallu Magalhães' },
    },
    transactionType: { name: 'Transferência' },
  },
  {
    id: 2,
    value: 12.06,
    createdAt: '2022-12-02',
    ownerAccount: {
      id: 1,
      user: { name: 'Mallu Magalhães' },
    },
    receiverAccount: {
      id: 2,
      user: { name: 'Sebastian' },
    },
    transactionType: { name: 'Transferência' },
  },
  {
    id: 3,
    value: 2,
    createdAt: '2022-10-12',
    ownerAccount: {
      id: 1,
      user: { name: 'Mallu Magalhães' },
    },
    receiverAccount: {
      id: 1,
      user: { name: 'Mallu Magalhães' },
    },
    transactionType: { name: 'Depósito' },
  },
  {
    id: 4,
    value: 10,
    createdAt: '2022-11-21',
    ownerAccount: {
      id: 1,
      user: { name: 'Mallu Magalhães' },
    },
    receiverAccount: {
      id: 2,
      user: { name: 'Sebastian' },
    },
    transactionType: { name: 'Transferência' },
  },
];

export const sentTransactionsMock = [
  transactionsListMock[1],
  transactionsListMock[3],
];

export const receivedTransactionsMock = [
  transactionsListMock[0],
  transactionsListMock[2],
];

export const transactionsAtLeastDateMock = [
  transactionsListMock[0],
  transactionsListMock[1],
  transactionsListMock[3],
];

export const transactionsUntilDateMock = [
  transactionsListMock[2],
  transactionsListMock[3],
];
