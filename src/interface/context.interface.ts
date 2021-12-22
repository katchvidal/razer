export interface IContext {
  req: IRequest;
  connection: IConnection;
}

export interface IRequest {
  headers: {
    authorization: string;
  };
}

export interface IConnection {
  authorization: string;
}
