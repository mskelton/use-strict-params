import { render } from "@testing-library/react"
import React from "react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { assertType, describe, expect, it } from "vitest"
import {
  Optional,
  StrictParams,
  TypeDef,
  useStrictParams,
  useStrictSearchParams,
} from "../lib/index.js"

function run<T extends TypeDef>(url: string, typedef: T) {
  let params: StrictParams<T>
  let searchParams: StrictParams<T>

  function Element() {
    params = useStrictParams(typedef)
    searchParams = useStrictSearchParams(typedef)[0]

    return null
  }

  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route index element={<Element />} />
        <Route path="/:string/:number/:boolean/:date?" element={<Element />} />
      </Routes>
    </MemoryRouter>,
  )

  return {
    params: params!,
    searchParams: searchParams!,
  }
}

describe("useStrictParams", () => {
  it("required params", () => {
    const { params } = run("/foo/123/true/2021-01-01", {
      boolean: Boolean,
      date: Date,
      number: Number,
      string: String,
    })
    const { boolean, date, number, string } = params

    assertType<string>(string)
    assertType<number>(number)
    assertType<boolean>(boolean)
    assertType<Date>(date)

    expect(string).toBe("foo")
    expect(boolean).toBeTruthy()
    expect(number).toBe(123)
    expect(date).toStrictEqual(new Date("2021-01-01"))
  })

  it("optional params", () => {
    const { params } = run("/foo/123/true/2021-01-01", {
      boolean: Optional(Boolean),
      date: Optional(Date),
      number: Optional(Number),
      string: Optional(String),
    })
    const { boolean, date, number, string } = params

    assertType<string | null>(string)
    assertType<number | null>(number)
    assertType<boolean | null>(boolean)
    assertType<Date | null>(date)

    // @ts-expect-error string is not null
    string.toString()
    // @ts-expect-error number is not null
    number.toString()
    // @ts-expect-error boolean is not null
    boolean.toString()
    // @ts-expect-error date is not null
    date.toString()

    expect(string).toBe("foo")
    expect(boolean).toBeTruthy()
    expect(number).toBe(123)
    expect(date).toStrictEqual(new Date("2021-01-01"))
  })

  it("missing param", () => {
    const { params } = run("/foo/123/true", {
      boolean: Optional(Boolean),
      date: Optional(Date),
      number: Optional(Number),
      string: Optional(String),
    })
    const { boolean, date, number, string } = params

    expect(string).toBe("foo")
    expect(boolean).toBeTruthy()
    expect(number).toBe(123)
    expect(date).toBeNull()
  })
})

describe("useStrictSearchParams", () => {
  it("required params", () => {
    const { searchParams } = run(
      "?boolean=true&string=foo&number=123&date=2021-01-01",
      {
        boolean: Boolean,
        date: Date,
        number: Number,
        string: String,
      },
    )
    const { boolean, date, number, string } = searchParams

    assertType<string>(string)
    assertType<number>(number)
    assertType<boolean>(boolean)
    assertType<Date>(date)

    expect(string).toBe("foo")
    expect(boolean).toBeTruthy()
    expect(number).toBe(123)
    expect(date).toStrictEqual(new Date("2021-01-01"))
  })

  it("optional params", () => {
    const { searchParams } = run(
      "?boolean=true&string=foo&number=123&date=2021-01-01",
      {
        boolean: Optional(Boolean),
        date: Optional(Date),
        number: Optional(Number),
        string: Optional(String),
      },
    )
    const { boolean, date, number, string } = searchParams

    assertType<string | null>(string)
    assertType<number | null>(number)
    assertType<boolean | null>(boolean)
    assertType<Date | null>(date)

    // @ts-expect-error 'string' is possibly 'null'
    string.toString()
    // @ts-expect-error 'number' is possibly 'null'
    number.toString()
    // @ts-expect-error 'boolean' is possibly 'null'
    boolean.toString()
    // @ts-expect-error 'date' is possibly 'null'
    date.toString()

    expect(string).toBe("foo")
    expect(boolean).toBeTruthy()
    expect(number).toBe(123)
    expect(date).toStrictEqual(new Date("2021-01-01"))
  })

  it("missing param", () => {
    const { searchParams } = run("?boolean=true&number=123", {
      boolean: Optional(Boolean),
      date: Optional(Date),
      number: Optional(Number),
      string: Optional(String),
    })
    const { boolean, date, number, string } = searchParams

    expect(string).toBeNull()
    expect(boolean).toBeTruthy()
    expect(number).toBe(123)
    expect(date).toBeNull()
  })
})
