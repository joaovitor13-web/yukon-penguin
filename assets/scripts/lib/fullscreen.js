(() => {
    function initFullscreen() {
        const root = document.documentElement;
        const request = root.requestFullscreen || root.webkitRequestFullscreen;
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        const enabled = document.fullscreenEnabled ?? document.webkitFullscreenEnabled;
        if (!request || !exit || enabled === false || document.getElementById('fullscreen-toggle')) return;

        const button = document.createElement('button');
        button.id = 'fullscreen-toggle';
        button.className = 'fullscreen-toggle';
        button.type = 'button';
        button.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="fullscreen-expand" d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><path class="fullscreen-collapse" d="M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"/></svg>';
        const status = document.createElement('span');
        status.className = 'fullscreen-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        const isFullscreen = () => Boolean(document.fullscreenElement || document.webkitFullscreenElement);
        const update = () => {
            const active = isFullscreen();
            const label = active ? 'Sair da tela cheia' : 'Tela cheia';
            button.setAttribute('aria-label', label);
            button.setAttribute('aria-pressed', String(active));
            button.title = label;
            status.textContent = '';
        };
        button.addEventListener('click', async () => {
            button.disabled = true;
            try {
                if (isFullscreen()) await exit.call(document);
                else await request.call(root);
                update();
            } catch {
                const message = 'Não foi possível alterar a tela cheia. Tente novamente.';
                status.textContent = message;
                button.title = message;
            } finally {
                button.disabled = false;
            }
        });
        document.addEventListener('fullscreenchange', update);
        document.addEventListener('webkitfullscreenchange', update);
        update();
        document.body.append(button, status);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFullscreen, { once: true });
    } else initFullscreen();
})();
