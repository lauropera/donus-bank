export default interface ITransactionType {
  id: number;
  name: string;
}

export type ITransactionTypeCreation = Omit<ITransactionType, 'id'>;
