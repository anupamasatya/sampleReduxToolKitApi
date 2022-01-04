export type DataResponse = {
  Data: [];

  // id: number;
  // title: string;
  // price: number;
  // description: string;
  // category: string;
  // image: string;
  // rating: {
  //   rate: number;
  //   count: number;
  // };
};

export type UserResponseError = {
  error: string;
};
export type AxiosProps = {
  type: any;
  url: any;
  params?: any;
  header?: any;
};
