const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { runInNewContext } = require('node:vm');

const recipe = readFileSync('content/recipes/chocolate-chip-pancakes.md', 'utf8');
const originals = recipe.split('## Ingredients\n')[1].split('\n\n')[0].split('\n').map(line => line.slice(2));
const script = readFileSync('static/recipe-scale.js', 'utf8');

// Small DOM fixture exercises the browser entry point and actual recipe text.
function setup() {
    const rows = originals.map(textContent => ({ textContent }));
    const input = { value: '1', attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; }, addEventListener(_, fn) { this.change = fn; } };
    const buttons = ['0.5', '1', '2'].map(scale => ({ dataset: { scale }, setAttribute(_, value) { this.pressed = value; }, addEventListener(_, fn) { this.click = fn; } }));
    const status = {};
    const panel = { hidden: true, querySelector: selector => selector === 'input' ? input : status, querySelectorAll: () => buttons };
    const heading = { nextElementSibling: { tagName: 'UL', children: rows }, insertAdjacentElement(position, element) { assert.equal(position, 'afterend'); assert.equal(element, panel); } };
    runInNewContext(script, { document: { querySelector: selector => selector === '[data-recipe-scale]' ? panel : heading } });
    return { rows, input, buttons, panel, status, scale(value) { input.value = value; input.change(); }, text() { return rows.map(row => row.textContent); } };
}

test('Beyoncé rule: 2× doubles every pancake quantity, including metric equivalents', () => {
    const ui = setup();
    assert.equal(ui.panel.hidden, false);
    ui.buttons[2].click();
    assert.deepEqual(ui.text(), [
        '3 cups (390 g) all-purpose flour',
        '5 teaspoons baking powder',
        '1 teaspoon fine salt',
        '2 tablespoon granulated sugar',
        '2 1/2 cups (590 ml) milk, room temperature',
        '2 large egg',
        '6 tablespoons (84 g) unsalted butter, melted',
        '1 teaspoon vanilla',
        '1 cup (168 g) chocolate chips',
    ]);
    assert.equal(ui.buttons[2].pressed, 'true');
    assert.equal(ui.status.textContent, 'Ingredients scaled to 2×');
});

test('Beyoncé rule: half batches and custom decimals use original quantities', () => {
    const ui = setup();
    ui.buttons[0].click();
    assert.equal(ui.rows[0].textContent, '3/4 cups (97.5 g) all-purpose flour');
    assert.equal(ui.rows[5].textContent, '1/2 large egg');
    ui.scale('2.5');
    assert.equal(ui.rows[0].textContent, '3 3/4 cups (487.5 g) all-purpose flour');
    ui.scale('0.3');
    assert.equal(ui.rows[0].textContent, '0.45 cups (58.5 g) all-purpose flour');
    ui.buttons[1].click();
    assert.deepEqual(ui.text(), originals);
});

test('Beyoncé rule: invalid custom scales retain the last valid quantities and recover', () => {
    const ui = setup();
    ui.scale('2');
    const last = ui.text();
    for (const invalid of ['', '0', '-1', 'NaN', 'Infinity', '1e309', '1e308']) {
        ui.scale(invalid);
        assert.deepEqual(ui.text(), last);
        assert.equal(ui.input.attributes['aria-invalid'], 'true');
        assert.match(ui.status.textContent, /positive number/);
    }
    ui.scale('1');
    assert.equal(ui.input.attributes['aria-invalid'], undefined);
    assert.deepEqual(ui.text(), originals);
});

test('Beyoncé rule: pages without scaling or an ingredient list stay safe', () => {
    runInNewContext(script, { document: { querySelector: () => null } });
    const panel = { hidden: true };
    runInNewContext(script, { document: { querySelector: selector => selector === '[data-recipe-scale]' ? panel : null } });
    assert.equal(panel.hidden, true);
});

test('Beyoncé rule: only pancakes opt in and template gates both controls and script', () => {
    const enabled = readdirSync('content/recipes').filter(path => /scalable\s*=\s*true/.test(readFileSync(`content/recipes/${path}`, 'utf8')));
    assert.deepEqual(enabled, ['chocolate-chip-pancakes.md']);
    const template = readFileSync('templates/page.html', 'utf8');
    assert.match(template, /{% if page.extra.scalable \| default\(value=false\) %}\s*<div class="recipe-scale"/);
    assert.match(template, /{% if page.extra.scalable \| default\(value=false\) %}\s*<script defer src="{{ get_url\(path="recipe-scale.js"\) }}"><\/script>\s*{% endif %}/);
    assert.equal(originals.length, 9);
});
