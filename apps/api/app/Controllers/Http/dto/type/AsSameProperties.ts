export type AsSameProperties<T> = {
  [key in keyof T]: any
}
