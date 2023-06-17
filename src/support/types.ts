export type MapValues<T, B> = {
    [K in keyof T]: T[K] extends Record<any, any> ? MapValues<T[K], B> : B
  }
  
export type DeepPartial<T> = T extends object
? {
    [P in keyof T]?: DeepPartial<T[P]>
    }
: T
  