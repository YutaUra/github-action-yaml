# github-action-yaml

## Install

```bash
npm install github-action-yaml
```

## Usage

```sh
npx github-action-yaml generate ./src/generated/github-action.ts
```

## Example

```ts
import { parseInputs } from './generated/github-action';

const main = () => {
  const inputs = parseInputs()
}

main()
```

### Generate Options

| Option          | Description | Default      | Required |
| --------------- | ----------- | ------------ | -------- |
| `output`        | Output file |              | true     |
| `-i`, `--input` | Input file  | `action.yml` | false    |
| `--watch`       | Watch mode  |              | false    |
