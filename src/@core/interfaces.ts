export interface IUserModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IDataModel {
  data: string;
  owner: string; //email
  createdAt: string;
}