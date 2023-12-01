# use-strict-params

[![Build status](https://github.com/mskelton/use-strict-params/workflows/Build/badge.svg)](https://github.com/mskelton/use-strict-params/actions)

Strictly typed params for React router.

## Installation

### npm

```sh
npm install use-strict-params
```

### Yarn

```sh
yarn add use-strict-params
```

### pnpm

```sh
pnpm add use-strict-params
```

### bun

```sh
bun add use-strict-params
```

## Usage

### `useStrictParams`

A typed variant of `useParams`. The following types are supported:

- `String`
- `Number`
- `Boolean`
- `Date`

```typescript
const { userId } = useStrictParams({ userId: Number })
```

### `useStrictSearchParams`

A typed variant of `useSearchParams`. The following types are supported:

- `String`
- `Number`
- `Boolean`
- `Date`

```typescript
const { query } = useStrictSearchParams({ query: String })
```

### `Optional`

Marks a type as optional which will change the return type to allow `null`.

```typescript
const { query } = useStrictSearchParams({ query: Optional(String) })
```
