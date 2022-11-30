export default interface ITransaction extends ITransactionData {
  id: number;
  createdAt: Date;
}

export interface ITransactionData {
  ownerAccountId: number;
  receiverAccountId: number;
  transactionTypeId: number;
  value: number;
}

export type TransactionMethod = 'cpf' | 'email';
export type TransactionFilter = 'sent' | 'received' | 'date';

export interface ITransactionCreation extends ITransactionData {
  email?: string;
  cpf?: string;
}
