export default interface IUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  password: string;
  accountId: number;
}

export type IUserCreation = Omit<IUser, 'id'>;

export type IUserReturned = Omit<IUser, 'password'>;
