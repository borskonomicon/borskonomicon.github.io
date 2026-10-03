(() => {
    const panel = document.querySelector('[data-recipe-scale]');
    if (!panel) return;
    const heading = document.querySelector('.content #ingredients');
    const list = heading?.nextElementSibling;
    if (!list || list.tagName !== 'UL') return;

    // Capture once so every change uses the original quantities, never a prior scale.
    const ingredients = [...list.children].map(element => ({ element, original: element.textContent }));
    const input = panel.querySelector('input');
    const presets = [...panel.querySelectorAll('[data-scale]')];
    const status = panel.querySelector('[role="status"]');
    const quantities = /\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/g;
    const parse = text => text.split(/\s+/).reduce((sum, part) => {
        const [numerator, denominator = 1] = part.split('/').map(Number);
        return sum + numerator / denominator;
    }, 0);
    const format = (value, metric) => {
        const eighths = Math.round(value * 8);
        if (!metric && eighths > 0 && Math.abs(value - eighths / 8) < 1e-9) {
            const whole = Math.floor(eighths / 8);
            const remainder = eighths % 8;
            if (!remainder) return String(whole);
            const divisor = remainder % 4 === 0 ? 4 : remainder % 2 === 0 ? 2 : 1;
            return `${whole ? whole + ' ' : ''}${remainder / divisor}/${8 / divisor}`;
        }
        return String(Number(value.toPrecision(10)));
    };
    const update = () => {
        const multiplier = Number(input.value);
        const valid = input.value.trim() !== '' && Number.isFinite(multiplier) && multiplier > 0;
        const scaled = valid ? ingredients.map(({ original }) => multiplier === 1 ? original :
            original.replace(quantities, (quantity, offset) => format(parse(quantity) * multiplier,
                /^\s*(g|ml)\b/.test(original.slice(offset + quantity.length))))) : [];
        if (!valid || scaled.some(text => text.includes('Infinity'))) {
            input.setAttribute('aria-invalid', 'true');
            status.textContent = 'Enter a positive number. Ingredients keep the last valid scale.';
            return;
        }
        input.removeAttribute('aria-invalid');
        ingredients.forEach(({ element }, index) => { element.textContent = scaled[index]; });
        presets.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.scale) === multiplier)));
        status.textContent = multiplier === 1 ? 'Original quantities · 1×' : `Ingredients scaled to ${multiplier}×`;
    };
    presets.forEach(button => button.addEventListener('click', () => {
        input.value = button.dataset.scale;
        update();
    }));
    input.addEventListener('input', update);
    heading.insertAdjacentElement('afterend', panel);
    panel.hidden = false;
})();
