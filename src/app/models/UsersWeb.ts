export class UsersWeb {
  username: string | undefined;
  password: string | undefined;
  Confirmpassword: string | undefined;
  Address: string | undefined;
  Email: string | undefined;
  token: string | undefined;
  FullName: string | undefined;
  CounterId: number | undefined;

  isActive: boolean | undefined;
  EmailUserId: string | undefined;
  EmailPassword: string | undefined;
  EmpId: number | undefined;
  Designation: string | undefined;

  UserType: string | undefined;

  originalUserName: string | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;

  usersShop!: UsersShop[];
}

export class UsersShop {
  UsersShopId: number | undefined;
  UserId: string | undefined;
  ShopID: string | undefined;
  ShopName: string | undefined;
}

export class RefreshTokenRequest {
  RefreshToken: string | undefined;
  accessToken: string | undefined;
}
