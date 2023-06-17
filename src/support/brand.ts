declare const brand: unique symbol;

export type Brand<A extends number | string | boolean> = A & { readonly [brand]: unique symbol }

type BaseOf<A> = A extends Brand<infer Base> ? Base : never

export const to = <A extends Brand<any>>(value: BaseOf<A>) => value as A

export const from = <A extends Brand<any>>(value: A) => value as BaseOf<A>