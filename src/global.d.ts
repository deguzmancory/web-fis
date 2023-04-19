type AuthErrorCode =
  | 'UserNotConfirmedException'
  | 'NotAuthorizedException'
  | 'UserNotFoundException'
  | 'CodeMismatchException'
  | 'ExpiredCodeException'
  | 'LimitExceededException'
  | 'InvalidPasswordException'
  | 'InvalidParameterException'
  | 'UsernameExistsException';

declare type AuthError = {
  code?: AuthErrorCode;
  name?: string;
  message?: string;
};

declare type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepReadonlyArray<U>
  : DeepReadonlyObject<T>;

declare type Primitive = string | number | boolean | null | undefined;

declare interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

declare type DeepReadonlyObject = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

declare type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
