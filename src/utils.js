import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    statSync,
    writeFileSync
} from 'fs';
import { basename, dirname, join } from 'path';

const FgCyan = '\x1b[36m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';

export const info = (message) => {
    console.log(FgCyan, message);
};
export const success = (message) => {
    console.log(FgGreen, message);
};
export const error = (message) => {
    console.error(FgRed, message);
    process.exit(1);
};

export function hasFlag(flag) {
    return process.argv.includes(flag);
}

export function flag(key) {
    const index = process.argv.indexOf(key);
    const flagValue = () => {
        const value = process.argv[index + 1];

        return value === undefined ? true : value;
    };

    return index === -1 ? undefined : flagValue();
}

export function mkdirRecursive(directory) {
    const path = directory.replace(/\/$/, '').split('/');
    const length = path.length;

    for (let i = 1; i <= length; i++) {
        const segment = path.slice(0, i).join('/');

        if (!existsSync(segment)) {
            mkdirSync(segment);
        }
    }
}

function templateEngine(stringTemplate, data = {}) {
    return stringTemplate.replace(/<%\s*(\w*)\s*%>/g, (_, key) =>
        data.hasOwnProperty(key) ? data[key] : `__key_${key}_undefined__`
    );
}

function templateData(name = '', type = '') {
    const uppercase = (str) => str.toUpperCase();
    const camelCase = (str) =>
        str.replace(/-(\w)/g, (_, letter) => uppercase(letter));
    const titleCase = (str) => uppercase(str.charAt(0)) + str.slice(1);
    const hyphenCase = (str) =>
        str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const screamSnakeCaseName = (str) =>
        hyphenCase(str).replace(/-/g, '_').toUpperCase();
    const camelCaseName = camelCase(name);
    const camelCaseType = camelCase(type);

    return {
        camelCaseName,
        camelCaseType,
        hyphenCaseName: hyphenCase(name),
        hyphenCaseType: hyphenCase(type),
        name,
        screamSnakeCaseName: screamSnakeCaseName(name),
        screamSnakeCaseType: screamSnakeCaseName(type),
        titleCaseName: titleCase(camelCaseName),
        titleCaseType: titleCase(camelCaseType),
        type
    };
}

function writeFilesWithContent({ input, name, type, output, fileName }) {
    const stringTemplate = readFileSync(join(input, fileName), 'utf-8');
    const content = templateEngine(stringTemplate, templateData(name, type));
    const filePath = join(output, fileName.replace(/\btemp\b/g, name));

    try {
        writeFileSync(filePath, content);
        success(`File ${filePath} created`);
    } catch (e) {
        error(e);
    }
}

export function generator({ input, output, name, type }) {
    if (!input) throw Error('input should not be empty');
    if (!output) throw Error('output should not be empty');

    mkdirRecursive(output);

    if (isFile(input)) {
        return writeFilesWithContent({
            input: dirname(input),
            name,
            type,
            output,
            fileName: basename(input)
        });
    }

    return readdirSync(input).forEach((item) => {
        isFile(join(input, item))
            ? writeFilesWithContent({
                  input,
                  name,
                  type,
                  output,
                  fileName: item
              })
            : generator({
                  input: join(input, item),
                  output: join(output, item),
                  name,
                  type
              });
    });
}

function isFile(input) {
    return statSync(join(input)).isFile();
}
