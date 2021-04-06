import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { error, generator, flag, info } from './utils';

const cwd = resolve(process.cwd());

const versionOption = (flag('-v') || flag('--version'));
const helpOption = flag('-h') || flag('--help');
const outputOption = flag('-o') || flag('--output');
const inputOption = flag('-i') || flag('--input');
const nameOption = flag('-n') || flag('--name');
const configFilePathOption = join(
    cwd,
    flag('-c') || flag('--config') || 'g-g.config.js'
);

if (versionOption) {
    const packageJson = readFileSync(join(cwd, 'package.json'));

    info(JSON.parse(packageJson.toString()).version);
    process.exit();
}

if (helpOption) {
    info(` Usage: g-g [command] <name> [options] 

  Examples:
    g-g command <name> // Name of the \${command} to be created

  Options:
    --config, -c     Config file path. Default: g-g.config.js
    --name, -n       It replace the name variable
    --output, -o     Rewrites the output configuration. Default: the output defined in the config file 
    --templates, -t  Rewrites the templatesDir configuration. Default: the templatesDir defined in the config file 
`);
    process.exit();
}

if (!existsSync(configFilePathOption) && !versionOption && !helpOption) {
    error(
        `Error: You must create the config file.
        Please, read the documentation.`
    );
}

const config = require(configFilePathOption).default;
const templates = config.templates;

if (!templates || !templates.length) {
    error(
        `Error: You must define an array of templates in to the config file.
        Please, read the documentation.`
    );
}

const argv = process.argv;
const type = argv[2];
const name = nameOption || argv[3];
const templateByType = templates.find((template) => template.type === type);

if (!type || /^-/.test(type)) {
    error(
        `Error: You must defined the type in your command, ${type} is not valid.
        Please, read the documentation.`
    );
}

if (/^-/.test(name)) {
    error(
        `Error: You must defined the name in your command, ${name} is not valid.
        Please, read the documentation.`
    );
}

if (!templateByType || !templateByType.type) {
    error(
        `Error: You must defined the type ${type} in to the template of the config file.
        Please, read the documentation.`
    );
}

const input = templateByType.input;

if (!input) {
    error(
        `Error: You must defined the input in to the template with type ${type} from your config file.
        Please, read the documentation.`
    );
}

if (!existsSync(join(cwd, inputOption || input))) {
    error(
        `Error: You must create the template in ${join(
            cwd,
            inputOption || input
        )}.
        Please, read the documentation.`
    );
}

const output = templateByType.output;

if (!output) {
    error(
        `Error: You must defined the output in to the template ${type} from your config file.
        Please, read the documentation.`
    );
}

generator({
    input: join(cwd, inputOption || input),
    output: join(outputOption || output),
    name,
    type
});
