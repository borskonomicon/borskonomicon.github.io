const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');

const script = readFileSync('static/cook-mode.js', 'utf8');

test('Beyoncé rule: cook mode safely exits on pages without a toggle', () => {
    runInNewContext(script, { document: { querySelector: () => null } });
});

test('Beyoncé rule: unsupported wake lock disables cook mode', () => {
    const classes = [];
    const toggle = { closest: () => ({ classList: { add: name => classes.push(name) } }) };
    runInNewContext(script, { document: { querySelector: () => toggle }, navigator: {} });
    assert.equal(toggle.disabled, true);
    assert.deepEqual(classes, ['is-disabled']);
});

test('Beyoncé rule: cook mode requests and releases the screen lock', async () => {
    const events = {};
    let requested = 0;
    let released = 0;
    let onRelease;
    const toggle = { checked: true, closest: () => ({}), addEventListener: (name, fn) => { events[name] = fn; } };
    const document = { querySelector: () => toggle, addEventListener() {} };
    const lock = { addEventListener: (_, fn) => { onRelease = fn; }, release: async () => { released++; onRelease(); } };
    const navigator = { wakeLock: { request: async type => { assert.equal(type, 'screen'); requested++; return lock; } } };
    runInNewContext(script, { document, navigator });
    events.change();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(requested, 1);
    toggle.checked = false;
    events.change();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(released, 1);
    assert.equal(toggle.checked, false);
});
