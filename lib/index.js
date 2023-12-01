import { useParams, useSearchParams } from "react-router-dom"

function parse(type, value) {
  switch (type) {
    case Date:
      return new Date(value)
    default:
      return type(value)
  }
}

function toStrict(params, typedef) {
  const p = Object.fromEntries(params)

  return Object.entries(typedef).reduce((acc, [key, type]) => {
    const value = p[key]
    return { ...acc, [key]: value ? parse(type, value) : null }
  }, {})
}

/** Typed variant of `useParams` */
export function useStrictParams(typedef) {
  const params = useParams()
  return toStrict(Object.entries(params), typedef)
}

/** Typed variant of `useSearchParams` */
export function useStrictSearchParams(typedef) {
  const [searchParams, setSearchParams] = useSearchParams()

  const setStrictParams = (params) => {
    setSearchParams(
      params instanceof URLSearchParams ? params : (
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ),
    )
  }

  return [toStrict([...searchParams.entries()], typedef), setStrictParams]
}

/**
 * Marks a param as optional. This is purely for the sake of TypeScript, it
 * doesn't change the runtime behavior.
 */
export const Optional = (type) => (value) => (value ? parse(type, value) : null)
