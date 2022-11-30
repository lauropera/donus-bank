export default interface IAccount {
  id: number;
  balance: number;
}

export type IAccountCreation = Omit<IAccount, 'id'>;
