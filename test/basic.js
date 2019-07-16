const fs = require('fs');
const tap = require('tap');

const sass = require('node-sass');
const stylus = require('stylus');
const less = require('less');
const pug = require('pug');

const SASS_STYLESHEET = './src/yamm.scss';
const LESS_STYLESHEET = './src/yamm.less';
const STYL_STYLESHEET = './src/yamm.styl';
const PUG_TEMPLATE = './demo/pug/index.pug';

let sass_result, styl_result, less_result;

// SASS
const compileSaas = () => {
    const sass_content = fs.readFileSync(SASS_STYLESHEET, 'utf8');
    const output = sass.renderSync({
        data: sass_content
    });
    sass_result = output.css.toString();
};

// Stylus
const compileStylus = () => {
    const styl_content = fs.readFileSync(STYL_STYLESHEET, 'utf8');
    styl_result = stylus.render(styl_content);
};

// Less
const compileLess = cb => () => {
    const less_content = fs.readFileSync(LESS_STYLESHEET, 'utf8');
    less.render(less_content).then(output => {
        less_result = output.css;
        cb();
    });
};

// Pug
const compilePug = () => pug.renderFile(PUG_TEMPLATE);

// Minify conetnt
const min = str =>
    str
        .replace(/(?:\r\n|\r|\n|\s)/g, '') /* spaces and new lines */
        .replace(/\*(.|\n)*?\*/g, ''); /* comment blocks (stylus removes !)*/

/**
 * Suites
 * - Test everything compiles fine
 * - Test everything compiles the same output
 */

tap.test('Compiles without throw error', tap => {
    tap.test('SASS sources', tap => {
        tap.doesNotThrow(compileSaas);
        tap.end();
    });
    tap.test('STYLUS sources', tap => {
        tap.doesNotThrow(compileStylus);
        tap.end();
    });
    tap.test('LESS sources', tap => {
        tap.doesNotThrow(compileLess(() => tap.end()));
    });
    tap.test('PUG demo', tap => {
        tap.doesNotThrow(compilePug);
        tap.end();
    });
    tap.end();
}).catch(tap.threw);

tap.test('Compiles the same output', tap => {
    tap.test('STYLUS vs SASS', tap => {
        tap.equal(min(sass_result), min(styl_result));
        tap.end();
    });
    tap.test('LESS vs SASS', tap => {
        tap.equal(min(sass_result), min(less_result));
        tap.end();
    });
    tap.end();
}).catch(tap.threw);
