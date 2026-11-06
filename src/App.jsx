import { useMemo, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

const demoNotification = {
  title: 'PIX recebido • NextPay',
  body: 'Você recebeu um PIX de R$ {valor}.',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

function App() {
  const [amount, setAmount] = useState('240.50');
  const [lastNotification, setLastNotification] = useState('Nenhuma notificação disparada ainda.');
  const [permissionState, setPermissionState] = useState('verificando');
  const [scheduleSeconds, setScheduleSeconds] = useState(8);

  const numericValue = useMemo(() => {
    const value = Number(String(amount).replace(',', '.'));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [amount]);

  const checkPermissions = async () => {
    try {
      const status = await LocalNotifications.checkPermissions();
      const nextState = status.display === 'granted' ? 'permitida' : 'pendente';
      setPermissionState(nextState);
      return nextState;
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      setPermissionState('indisponível');
      return 'indisponível';
    }
  };

  const requestPermission = async () => {
    try {
      const status = await LocalNotifications.requestPermissions();
      const nextState = status.display === 'granted' ? 'permitida' : 'bloqueada';
      setPermissionState(nextState);
      if (status.display !== 'granted') {
        setLastNotification('Permissão de notificação bloqueada pelo usuário.');
      }
      return status.display === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      setPermissionState('indisponível');
      return false;
    }
  };

  const triggerPixNotification = async () => {
    const finalValue = numericValue || 0;
    const notification = {
      ...demoNotification,
      body: demoNotification.body.replace('{valor}', formatCurrency(finalValue)),
    };

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setLastNotification('O app precisa de permissão para mostrar a notificação local.');
        return;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title: notification.title,
            body: notification.body,
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: { pixValue: finalValue, origin: 'NextPay' },
          },
        ],
      });

      setLastNotification(`PIX recebido: ${notification.body}`);
    } catch (error) {
      console.error('Erro ao disparar notificação:', error);
      setLastNotification('Não foi possível disparar a notificação local.');
    }
  };

  const scheduleReminder = async () => {
    const finalValue = numericValue || 0;
    const when = new Date(Date.now() + scheduleSeconds * 1000);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setLastNotification('A notificação agendada foi bloqueada. Permissão necessária.');
        return;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now() + 1,
            title: 'Lembrete de cobrança NextPay',
            body: `Recebimento programado para ${when.toLocaleTimeString('pt-BR')} • ${formatCurrency(finalValue)}`,
            schedule: { at: when },
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: { pixValue: finalValue, scheduled: true },
          },
        ],
      });

      setLastNotification(`Notificação agendada para ${when.toLocaleTimeString('pt-BR')}.`);
    } catch (error) {
      console.error('Erro ao agendar lembrete:', error);
      setLastNotification('Não foi possível programar a notificação.');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">N</div>
          <div>
            <p className="eyebrow">Banco Digital</p>
            <h1>NextPay</h1>
          </div>
        </div>
        <button className="ghost-btn" onClick={checkPermissions}>Permissões</button>
      </header>

      <main className="dashboard">
        <section className="hero card">
          <div className="hero-copy">
            <span className="pill">Pagamento em tempo real</span>
            <h2>Seu PIX chega em segundos e chega com impacto.</h2>
            <p>
              Simule a chegada imediata de um valor, veja a notificação aparecer como se o cliente
              tivesse enviado dinheiro em tempo real e entenda a proposta de engajamento com Local Notifications.
            </p>
            <div className="cta-row">
              <button className="primary-btn" onClick={triggerPixNotification}>Simular PIX recebido</button>
              <button className="secondary-btn" onClick={scheduleReminder}>Agendar lembrete</button>
            </div>
          </div>

          <div className="balance-panel">
            <p>Saldo disponível</p>
            <strong>R$ 48.240,80</strong>
            <div className="mini-metrics">
              <div>
                <span>Receitas</span>
                <b>+ 14,8%</b>
              </div>
              <div>
                <span>Pix hoje</span>
                <b>R$ 9.400</b>
              </div>
            </div>
          </div>
        </section>

        <section className="controls-grid">
          <article className="card control-card">
            <div className="section-header">
              <span>Recebimento</span>
              <span className="status-dot active" />
            </div>
            <label className="field-label">Valor do PIX</label>
            <input
              type="text"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0,00"
            />
            <div className="amount-preview">{formatCurrency(numericValue)}</div>
          </article>

          <article className="card control-card">
            <div className="section-header">
              <span>Agendamento</span>
              <span className="status-dot" />
            </div>
            <label className="field-label">Lembrete em segundos</label>
            <input
              type="range"
              min="5"
              max="30"
              value={scheduleSeconds}
              onChange={(event) => setScheduleSeconds(Number(event.target.value))}
            />
            <div className="amount-preview">{scheduleSeconds}s</div>
          </article>

          <article className="card info-card">
            <div className="section-header">
              <span>Permissão</span>
              <span className={`status-pill ${permissionState}`}>{permissionState}</span>
            </div>
            <strong>Android 13+</strong>
            <p>
              A permissão POST_NOTIFICATIONS é obrigatória para que a notificação local apareça.
              Se o usuário bloquear, o alerta falha silenciosamente.
            </p>
          </article>
        </section>

        <section className="notification-panel card">
          <div className="notification-header">
            <h3>Notificação em tempo real</h3>
            <span>Local Notifications</span>
          </div>
          <div className="toast-demo">
            <div className="toast-icon">✓</div>
            <div>
              <strong>{demoNotification.title}</strong>
              <p>{demoNotification.body.replace('{valor}', formatCurrency(numericValue))}</p>
            </div>
          </div>
          <div className="history-box">
            <h4>Último evento</h4>
            <p>{lastNotification}</p>
          </div>
        </section>

        <section className="content-grid">
          <article className="card tutorial-card">
            <h3>Push vs Local Notification</h3>
            <ul>
              <li><strong>Local:</strong> gerada no próprio dispositivo, ideal para lembretes, alarmes e fluxo offline.</li>
              <li><strong>Push:</strong> originada em servidor remoto como Firebase ou Supabase, útil para ofertas e mensagens em tempo real.</li>
            </ul>
          </article>

          <article className="card tutorial-card">
            <h3>Instalação e sincronização</h3>
            <code>{`npm install @capacitor/local-notifications`}</code>
            <code>{`npx cap sync`}</code>
          </article>

          <article className="card tutorial-card wide">
            <h3>Fluxo de permissão Android 13+</h3>
            <pre>{`const solicitarPermissao = async () => {
  let status = await LocalNotifications.checkPermissions();

  if (status.display !== 'granted') {
    status = await LocalNotifications.requestPermissions();
  }

  return status.display === 'granted';
};`}</pre>
          </article>

          <article className="card tutorial-card wide">
            <h3>Disparo imediato e agendamento</h3>
            <pre>{`await LocalNotifications.schedule({
  notifications: [{
    title: 'Haruy Sushi 🍣',
    body: 'Seu pedido #1042 acabou de sair para entrega!',
    id: 1,
    schedule: { at: new Date(Date.now() + 8000) }
  }]
});`}</pre>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
