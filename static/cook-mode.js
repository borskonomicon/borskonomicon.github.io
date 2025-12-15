(() => {
    const toggle = document.querySelector('[data-cook-toggle]');
    if (!toggle) return;

    const shell = toggle.closest('.cook-mode');
    if (!('wakeLock' in navigator)) {
        toggle.disabled = true;
        shell?.classList.add('is-disabled');
        return;
    }

    let lock = null;

    const requestLock = async () => {
        if (lock) return;

        try {
            lock = await navigator.wakeLock.request('screen');
            lock.addEventListener('release', () => {
                lock = null;
                toggle.checked = false;
            });
        } catch (err) {
            toggle.checked = false;
        }
    };

    const releaseLock = async () => {
        if (!lock) return;
        try {
            await lock.release();
        } finally {
            lock = null;
        }
    };

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            requestLock();
        } else {
            releaseLock();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && toggle.checked) {
            requestLock();
        }
    });
})();
