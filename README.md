# g-g

Create repetitive code with a single command.

## Invoke

```console
npx gc-victor/g-g [type] <name> [options]
```

## Usage

```console
Usage: npx gc-victor/g-g [type] <name> [options] 

Examples:
    npx gc-victor/g-g component example

Options:
    --config, -c     Config file path. Default: g-g.config.js
    --name, -n       It replace the name variable
    --input, -i      Rewrites the input configuration. Default: the input defined in the config file 
    --output, -o     Rewrites the output configuration. Default: the output defined in the config file 
```

## Install

You can use npm or yarn to install it.

```console
npm install gc-victor/g-g#main
```

## Template Variables

Variable keys and the printed format.

Example using `name = 'test-name'` and `type = 'test-type'`.

- camelCaseName = 'testName'
- camelCaseType = 'testType'
- hyphenCaseName = 'test-name'
- hyphenCaseType = 'test-type'
- name = 'test-name'
- screamSnakeCaseName = 'TEST_NAME'
- screamSnakeCaseType = 'TEST_TYPE'
- titleCaseName = 'TestName'
- titleCaseType = 'TestType'
- type = 'test-type'

## Example 

Templates:

```
g-g
├── component
│   └── temp.component.js
│   └── temp.css
├── ...
```

g-g.config.js

```javascript
export default {
    templates: [
        {
            type: 'examples',
            input: './example/templates', // or a file
            output: './example/output',
        }
    ]
};
```

temp.component.js
```
function <% camelCaseName %>Component() { ... }
```

temp.css
```
.<% name %> {
     color: red;
}
```

Script:

```console
npx gc-victor/g-g component example
```

Output:

```
components
  └── example.component.js
  └── example.css
```

example.component.js
```javascript
function exampleComponent() { ... }
```

example.css
```css
.example {
     color: red;
}
```

## Compatible Versioning

### Summary

Given a version number MAJOR.MINOR, increment the:

- MAJOR version when you make backwards-incompatible updates of any kind
- MINOR version when you make 100% backwards-compatible updates

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR format.

[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg)](https://github.com/staltz/comver)

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If it hasn't, just open a [new clear and descriptive issue](../../issues/new).

### Commit message conventions

A specification for adding human and machine readable meaning to commit messages.

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone http://github.com/<your-username>/g-g`
-   Navigate to the newly cloned directory: `cd g-g`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   `npm run build` to verify your change doesn't increase output size.
-   `npm test` to make sure your change doesn't break anything.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://github.com/gc-victor/g-g/blob/master/LICENSE)
