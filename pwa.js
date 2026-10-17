(() => {
  'use strict';
  let deferredPrompt = null;
  const button = document.getElementById('installAppButton');
  const message = document.getElementById('installAppMessage');
  const say = (text) => { if (message) message.textContent = text; };
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (button) {
    if (isStandalone()) { button.hidden = true; say('Aplicativo instalado. Você pode acessá-lo pela tela inicial.'); }
    button.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        say(result && result.outcome === 'accepted' ? 'Instalação iniciada. Siga as instruções do dispositivo.' : 'Instalação cancelada. Você pode continuar usando pelo navegador.');
        deferredPrompt = null; button.hidden = true;
      } else {
        say('Para instalar no Android, abra o menu do navegador e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”, se disponível.');
      }
    });
  }
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); deferredPrompt = event;
    if (button) { button.hidden = false; button.textContent = 'Instalar aplicativo'; }
    say('O aplicativo está pronto para instalação neste dispositivo.');
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; if (button) button.hidden = true; say('EcoPlay instalado com sucesso.'); });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
