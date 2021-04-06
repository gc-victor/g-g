import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { expect, test } from 't-t';
import { generator, flag, hasFlag, mkdirRecursive } from '../src/utils';

const input = '__test_input__';
const fileName = 'example.temp.js';
const output = '__test_output__';
const name = 'test-name';
const type = 'test-type';
const noneFlag = '--none';
const emptyFlag = '--empty';
const versionFlag = '--version';
const versionValue = '1.0.0';

const writeTemplateFile = (flName = fileName) =>
    writeFileSync(
        `${input}/${flName}`,
        '<% UNKNOWN %> <% camelCaseName %> <% camelCaseType %> <% hyphenCaseName %> <% hyphenCaseType %> <% name %> <% screamSnakeCaseName %> <% screamSnakeCaseType %> <% titleCaseName %> <% titleCaseType %> <% type %>',
        (err) => {
            if (err) throw err;
        }
    );

test('should be false whe a flag is not set', () => {
    expect(hasFlag(noneFlag)).toBe(false);
});

test('should be true whe a flag is set', () => {
    process.argv = [versionFlag, versionValue];
    expect(hasFlag(versionFlag)).toBe(true);
});

test('should get the value set to a flag', () => {
    process.argv = [versionFlag, versionValue];
    expect(flag(versionFlag)).toBe(versionValue);
});

test('should return true whe a flag does not have value', () => {
    process.argv = [emptyFlag];
    expect(flag(emptyFlag)).toBe(true);
});

test('should return undefined whe a flag is not set', () => {
    expect(flag(noneFlag)).toBe(undefined);
});

test('should throw an error if the input is empty', () => {
    expect(() => {
        generator({
            input: '',
            name: '',
            type: '',
            output: ''
        });
    }).throws(new Error('input should not be empty'));
});

test('should throw an error if the output is empty', () => {
    expect(() => {
        generator({
            input,
            name: '',
            type: '',
            output: ''
        });
    }).throws(new Error('output should not be empty'));
});

test('should generate a file with the proper content having as an input a file', () => {
    mkdirRecursive(input);
    mkdirRecursive(output);
    writeTemplateFile(fileName);

    generator({ input: join(input, fileName), name, type, output });

    const string1 = readFileSync(join(output, 'example.test-name.js'), 'utf-8');

    expect(string1.trim()).toBe(
        '__key_UNKNOWN_undefined__ testName testType test-name test-type test-name TEST_NAME TEST_TYPE TestName TestType test-type'
    );

    execSync(`rm -rf ${input}`);
    execSync(`rm -rf ${output}`);
});

test('should generate a file with the proper content', () => {
    const fileName2 = 'example.temp.2.js';

    mkdirRecursive(input);
    mkdirRecursive(output);
    writeTemplateFile(fileName);
    writeTemplateFile(fileName2);

    generator({ input, name, type, output });

    const string1 = readFileSync(join(output, 'example.test-name.js'), 'utf-8');
    const string2 = readFileSync(
        join(output, 'example.test-name.2.js'),
        'utf-8'
    );

    expect(string1.trim()).toBe(
        '__key_UNKNOWN_undefined__ testName testType test-name test-type test-name TEST_NAME TEST_TYPE TestName TestType test-type'
    );

    expect(string2.trim()).toBe(
        '__key_UNKNOWN_undefined__ testName testType test-name test-type test-name TEST_NAME TEST_TYPE TestName TestType test-type'
    );

    execSync(`rm -rf ${input}`);
    execSync(`rm -rf ${output}`);
});
