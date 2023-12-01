/** Primitive types that are supported */
type Primitive =
  | NumberConstructor
  | StringConstructor
  | DateConstructor
  | BooleanConstructor

/** Returns the type that will be returned for the given primitive type. */
type Hint<T> = T extends StringConstructor
  ? string
  : T extends NumberConstructor
    ? number
    : T extends BooleanConstructor
      ? boolean
      : T extends DateConstructor
        ? Date
        : never

/** Transforms a primitive type into an optional type. */
type OptionalConstructor = <T extends Primitive>(
  type: T,
) => (value: unknown) => Hint<T> | null

/** An object containing the type definitions for all params. */
type TypeDef = Record<string, ReturnType<OptionalConstructor>>

/** The returned strictly typed params. */
type StrictParams<T extends TypeDef> = {
  [K in keyof T]: T[K] extends Primitive ? Hint<T[K]> : ReturnType<T[K]>
}

/** Typed variant of `useParams` */
export declare function useStrictParams<T extends TypeDef>(
  typedef: T,
): StrictParams<T>

/** Typed variant of `useSearchParams` */
export declare function useStrictSearchParams<T extends TypeDef>(
  typedef: T,
): [StrictParams<T>, (params: StrictParams<T> | URLSearchParams) => void]

/**
 * Marks a param as optional. This is purely for the sake of TypeScript, it
 * doesn't change the runtime behavior.
 */
export const Optional: OptionalConstructor
