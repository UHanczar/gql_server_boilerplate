// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
loginDefault: string | null;
users: Array<IUser | null>;
}

interface IUser {
__typename: "User";
id: string;
email: string;
password: string;
confirmed: boolean;
}

interface IMutation {
__typename: "Mutation";
login: Array<IError> | null;
register: Array<IError> | null;
deleteUser: boolean;
}

interface ILoginOnMutationArguments {
email?: string | null;
password?: string | null;
}

interface IRegisterOnMutationArguments {
email?: string | null;
password?: string | null;
}

interface IDeleteUserOnMutationArguments {
id: string;
}

interface IError {
__typename: "Error";
path: string;
message: string;
}
}

// tslint:enable
