import LoadingContainer from './index.tsx';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * LoadingContainer executes an async task on mount and shows a loading spinner
 * while the task is running. Once complete, it displays its children.
 *
 * NOTE: In these stories, the tasks use setTimeout to simulate async operations.
 * The loading duration can be controlled via the `delay` arg.
 */
const meta = {
  component: LoadingContainer,
  title: 'Components/LoadingContainer',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['small', 'large'],
      description: 'Size of the loading spinner',
    },
    task: {
      control: false,
      description: 'Async function to execute on mount',
    },
    children: {
      control: false,
      description: 'Content to display after loading completes',
    },
  },
} satisfies Meta<typeof LoadingContainer>;

type Story = StoryObj<typeof meta>;

// Helper to create a delayed task
const createDelayedTask = (delay: number) => async () => {
  await new Promise(resolve => setTimeout(resolve, delay));
};

// Helper for infinite loading (never resolves)
const createInfiniteTask = () => async () => {
  await new Promise(() => {}); // Never resolves
};

// Localized messages
const spinnerNeverStopsMessage = defineMessages({
  'en-US': 'This spinner never stops - useful for visual inspection.',
  'fr-FR': "Ce spinner ne s'arrête jamais - utile pour l'inspection visuelle.",
  'es-ES': 'Este spinner nunca se detiene: útil para inspección visual.',
  'de-DE': 'Dieser Spinner stoppt nie – nützlich für visuelle Inspektion.',
  'pt-BR': 'Este spinner nunca para - útil para inspeção visual.',
  'ru-RU': 'Этот спиннер никогда не останавливается — полезно для визуальной проверки.',
  'zh-CN': '此加载器永不停止 - 便于视觉检查。',
  'ja-JP': 'このスピナーは止まりません - 視覚的な検査に便利です。',
  'ko-KR': '이 스피너는 멈추지 않습니다 - 시각적 검사에 유용합니다.',
  'th-TH': 'สปินเนอร์นี้ไม่มีวันหยุด - มีประโยชน์สำหรับการตรวจสอบด้วยสายตา',
});

const smallSpinnerInspectionMessage = defineMessages({
  'en-US': 'Small spinner for visual inspection.',
  'fr-FR': "Petit spinner pour l'inspection visuelle.",
  'es-ES': 'Spinner pequeño para inspección visual.',
  'de-DE': 'Kleiner Spinner für visuelle Inspektion.',
  'pt-BR': 'Spinner pequeno para inspeção visual.',
  'ru-RU': 'Маленький спиннер для визуальной проверки.',
  'zh-CN': '用于视觉检查的小加载器。',
  'ja-JP': '視覚検査用の小さなスピナー。',
  'ko-KR': '시각적 검사용 작은 스피너입니다.',
  'th-TH': 'สปินเนอร์ขนาดเล็กสำหรับการตรวจสอบด้วยสายตา',
});

const contentLoadedMessage = defineMessages({
  'en-US': 'Content Loaded!',
  'fr-FR': 'Contenu chargé !',
  'es-ES': '¡Contenido cargado!',
  'de-DE': 'Inhalt geladen!',
  'pt-BR': 'Conteúdo carregado!',
  'ru-RU': 'Контент загружен!',
  'zh-CN': '内容已加载！',
  'ja-JP': 'コンテンツが読み込まれました！',
  'ko-KR': '콘텐츠가 로드되었습니다!',
  'th-TH': 'โหลดเนื้อหาแล้ว!',
});

const contentAppearsMessage = defineMessages({
  'en-US': 'This content appears after the task completes.',
  'fr-FR': 'Ce contenu apparaît après la fin de la tâche.',
  'es-ES': 'Este contenido aparece después de que se completa la tarea.',
  'de-DE': 'Dieser Inhalt erscheint nach Abschluss der Aufgabe.',
  'pt-BR': 'Este conteúdo aparece após a conclusão da tarefa.',
  'ru-RU': 'Это содержимое появляется после завершения задачи.',
  'zh-CN': '此内容在任务完成后显示。',
  'ja-JP': 'このコンテンツはタスク完了後に表示されます。',
  'ko-KR': '이 콘텐츠는 작업 완료 후 표시됩니다.',
  'th-TH': 'เนื้อหานี้จะปรากฏหลังจากงานเสร็จสิ้น',
});

const loadedContentSmallMessage = defineMessages({
  'en-US': 'Loaded content (small spinner).',
  'fr-FR': 'Contenu chargé (petit spinner).',
  'es-ES': 'Contenido cargado (spinner pequeño).',
  'de-DE': 'Geladener Inhalt (kleiner Spinner).',
  'pt-BR': 'Conteúdo carregado (spinner pequeno).',
  'ru-RU': 'Загруженный контент (маленький спиннер).',
  'zh-CN': '已加载的内容（小加载器）。',
  'ja-JP': '読み込まれたコンテンツ（小さなスピナー）。',
  'ko-KR': '로드된 콘텐츠 (작은 스피너).',
  'th-TH': 'เนื้อหาที่โหลดแล้ว (สปินเนอร์เล็ก)',
});

const loadedQuicklyMessage = defineMessages({
  'en-US': 'Loaded quickly!',
  'fr-FR': 'Chargé rapidement !',
  'es-ES': '¡Cargado rápidamente!',
  'de-DE': 'Schnell geladen!',
  'pt-BR': 'Carregado rapidamente!',
  'ru-RU': 'Загружено быстро!',
  'zh-CN': '快速加载！',
  'ja-JP': '素早く読み込まれました！',
  'ko-KR': '빠르게 로드되었습니다!',
  'th-TH': 'โหลดเร็ว!',
});

const finallyLoadedMessage = defineMessages({
  'en-US': 'Finally Loaded!',
  'fr-FR': 'Enfin chargé !',
  'es-ES': '¡Finalmente cargado!',
  'de-DE': 'Endlich geladen!',
  'pt-BR': 'Finalmente carregado!',
  'ru-RU': 'Наконец-то загружено!',
  'zh-CN': '终于加载完了！',
  'ja-JP': 'ついに読み込まれました！',
  'ko-KR': '드디어 로드되었습니다!',
  'th-TH': 'โหลดสำเร็จในที่สุด!',
});

const tookAWhileMessage = defineMessages({
  'en-US': 'This took a while (5 seconds).',
  'fr-FR': 'Cela a pris un certain temps (5 secondes).',
  'es-ES': 'Esto tomó un tiempo (5 segundos).',
  'de-DE': 'Das hat eine Weile gedauert (5 Sekunden).',
  'pt-BR': 'Isso levou um tempo (5 segundos).',
  'ru-RU': 'Это заняло некоторое время (5 секунд).',
  'zh-CN': '这花了一段时间（5 秒）。',
  'ja-JP': 'これは時間がかかりました（5秒）。',
  'ko-KR': '시간이 좀 걸렸습니다 (5초).',
  'th-TH': 'ใช้เวลาสักครู่ (5 วินาที)',
});

const userDashboardMessage = defineMessages({
  'en-US': 'User Dashboard',
  'fr-FR': 'Tableau de bord utilisateur',
  'es-ES': 'Panel de usuario',
  'de-DE': 'Benutzer-Dashboard',
  'pt-BR': 'Painel do usuário',
  'ru-RU': 'Панель пользователя',
  'zh-CN': '用户仪表板',
  'ja-JP': 'ユーザーダッシュボード',
  'ko-KR': '사용자 대시보드',
  'th-TH': 'แดชบอร์ดผู้ใช้',
});

const usernameLabel = defineMessages({
  'en-US': 'Username:',
  'fr-FR': "Nom d'utilisateur :",
  'es-ES': 'Nombre de usuario:',
  'de-DE': 'Benutzername:',
  'pt-BR': 'Nome de usuário:',
  'ru-RU': 'Имя пользователя:',
  'zh-CN': '用户名：',
  'ja-JP': 'ユーザー名：',
  'ko-KR': '사용자 이름:',
  'th-TH': 'ชื่อผู้ใช้:',
});

const levelLabel = defineMessages({
  'en-US': 'Level:',
  'fr-FR': 'Niveau :',
  'es-ES': 'Nivel:',
  'de-DE': 'Level:',
  'pt-BR': 'Nível:',
  'ru-RU': 'Уровень:',
  'zh-CN': '等级：',
  'ja-JP': 'レベル：',
  'ko-KR': '레벨:',
  'th-TH': 'ระดับ:',
});

const statusLabel = defineMessages({
  'en-US': 'Status:',
  'fr-FR': 'Statut :',
  'es-ES': 'Estado:',
  'de-DE': 'Status:',
  'pt-BR': 'Status:',
  'ru-RU': 'Статус:',
  'zh-CN': '状态：',
  'ja-JP': 'ステータス：',
  'ko-KR': '상태:',
  'th-TH': 'สถานะ:',
});

const onlineStatus = defineMessages({
  'en-US': 'Online',
  'fr-FR': 'En ligne',
  'es-ES': 'En línea',
  'de-DE': 'Online',
  'pt-BR': 'Online',
  'ru-RU': 'В сети',
  'zh-CN': '在线',
  'ja-JP': 'オンライン',
  'ko-KR': '온라인',
  'th-TH': 'ออนไลน์',
});

const errorDisplaysMessage = defineMessages({
  'en-US': 'Content still displays even if task fails (check console for error).',
  'fr-FR': "Le contenu s'affiche toujours même si la tâche échoue (vérifiez la console pour l'erreur).",
  'es-ES': 'El contenido se muestra incluso si la tarea falla (revise la consola para el error).',
  'de-DE': 'Inhalt wird auch dann angezeigt, wenn die Aufgabe fehlschlägt (prüfen Sie die Konsole auf Fehler).',
  'pt-BR': 'O conteúdo ainda é exibido mesmo se a tarefa falhar (verifique o console para o erro).',
  'ru-RU': 'Контент отображается, даже если задача не выполнена (проверьте консоль на наличие ошибок).',
  'zh-CN': '即使任务失败，内容仍会显示（检查控制台错误）。',
  'ja-JP': 'タスクが失敗してもコンテンツは表示されます（エラーはコンソールで確認してください）。',
  'ko-KR': '작업이 실패하더라도 콘텐츠가 표시됩니다 (오류는 콘솔을 확인하세요).',
  'th-TH': 'เนื้อหายังแสดงแม้งานล้มเหลว (ตรวจสอบคอนโซลสำหรับข้อผิดพลาด)',
});

const largeSpinner1sLabel = defineMessages({
  'en-US': 'Large Spinner (1s):',
  'fr-FR': 'Grand spinner (1s) :',
  'es-ES': 'Spinner grande (1s):',
  'de-DE': 'Großer Spinner (1s):',
  'pt-BR': 'Spinner grande (1s):',
  'ru-RU': 'Большой спиннер (1с):',
  'zh-CN': '大加载器（1秒）：',
  'ja-JP': '大きなスピナー（1秒）：',
  'ko-KR': '큰 스피너 (1초):',
  'th-TH': 'สปินเนอร์ขนาดใหญ่ (1 วินาที):',
});

const smallSpinner2sLabel = defineMessages({
  'en-US': 'Small Spinner (2s):',
  'fr-FR': 'Petit spinner (2s) :',
  'es-ES': 'Spinner pequeño (2s):',
  'de-DE': 'Kleiner Spinner (2s):',
  'pt-BR': 'Spinner pequeno (2s):',
  'ru-RU': 'Маленький спиннер (2с):',
  'zh-CN': '小加载器（2秒）：',
  'ja-JP': '小さなスピナー（2秒）：',
  'ko-KR': '작은 스피너 (2초):',
  'th-TH': 'สปินเนอร์ขนาดเล็ก (2 วินาที):',
});

const largeSpinner3sLabel = defineMessages({
  'en-US': 'Large Spinner (3s):',
  'fr-FR': 'Grand spinner (3s) :',
  'es-ES': 'Spinner grande (3s):',
  'de-DE': 'Großer Spinner (3s):',
  'pt-BR': 'Spinner grande (3s):',
  'ru-RU': 'Большой спиннер (3с):',
  'zh-CN': '大加载器（3秒）：',
  'ja-JP': '大きなスピナー（3秒）：',
  'ko-KR': '큰 스피너 (3초):',
  'th-TH': 'สปินเนอร์ขนาดใหญ่ (3 วินาที):',
});

const firstLoadedMessage = defineMessages({
  'en-US': 'First loaded',
  'fr-FR': 'Premier chargé',
  'es-ES': 'Primero cargado',
  'de-DE': 'Zuerst geladen',
  'pt-BR': 'Primeiro carregado',
  'ru-RU': 'Первый загружен',
  'zh-CN': '首先加载',
  'ja-JP': '最初に読み込まれました',
  'ko-KR': '첫 번째 로드됨',
  'th-TH': 'โหลดแรก',
});

const secondLoadedMessage = defineMessages({
  'en-US': 'Second loaded',
  'fr-FR': 'Deuxième chargé',
  'es-ES': 'Segundo cargado',
  'de-DE': 'Zweites geladen',
  'pt-BR': 'Segundo carregado',
  'ru-RU': 'Второй загружен',
  'zh-CN': '第二个加载',
  'ja-JP': '2番目に読み込まれました',
  'ko-KR': '두 번째 로드됨',
  'th-TH': 'โหลดที่สอง',
});

const thirdLoadedMessage = defineMessages({
  'en-US': 'Third loaded',
  'fr-FR': 'Troisième chargé',
  'es-ES': 'Tercero cargado',
  'de-DE': 'Drittes geladen',
  'pt-BR': 'Terceiro carregado',
  'ru-RU': 'Третий загружен',
  'zh-CN': '第三个加载',
  'ja-JP': '3番目に読み込まれました',
  'ko-KR': '세 번째 로드됨',
  'th-TH': 'โหลดที่สาม',
});

export const SpinnerOnly: Story = {
  name: 'Spinner Only (no loading)',
  args: {
    size: 'large',
    task: createInfiniteTask(),
  },
  render: (args, context) => {
    const { globals } = context;
    const message = resolveLocaleValue(globals.locale as string, spinnerNeverStopsMessage);
    return (
      <div data-locale={globals.locale}>
        <p style={{ marginBottom: 16, fontSize: 14, color: '#999', fontStyle: 'italic' }}>{message}</p>
        <LoadingContainer {...args}>
          <div>This content never shows</div>
        </LoadingContainer>
      </div>
    );
  },
};

export const SpinnerOnlySmall: Story = {
  name: 'Spinner Only - Small',
  args: {
    size: 'small',
    task: createInfiniteTask(),
  },
  render: (args, context) => {
    const { globals } = context;
    const message = resolveLocaleValue(globals.locale as string, smallSpinnerInspectionMessage);
    return (
      <div data-locale={globals.locale}>
        <p style={{ marginBottom: 16, fontSize: 14, color: '#999', fontStyle: 'italic' }}>{message}</p>
        <LoadingContainer {...args}>
          <div>This content never shows</div>
        </LoadingContainer>
      </div>
    );
  },
};

export const LargeSpinner: Story = {
  name: 'Large Spinner (2s delay)',
  args: {
    size: 'large',
    task: createDelayedTask(2000),
  },
  render: (args, context) => {
    const { globals } = context;
    const heading = resolveLocaleValue(globals.locale as string, contentLoadedMessage);
    const description = resolveLocaleValue(globals.locale as string, contentAppearsMessage);
    return (
      <LoadingContainer {...args}>
        <div style={{ padding: 16, backgroundColor: '#2a2a2a', borderRadius: 4 }} data-locale={globals.locale}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{heading}</h3>
          <p style={{ margin: 0, color: '#ccc' }}>{description}</p>
        </div>
      </LoadingContainer>
    );
  },
};

export const SmallSpinner: Story = {
  name: 'Small Spinner (2s delay)',
  args: {
    size: 'small',
    task: createDelayedTask(2000),
  },
  render: (args, context) => {
    const { globals } = context;
    const message = resolveLocaleValue(globals.locale as string, loadedContentSmallMessage);
    return (
      <LoadingContainer {...args}>
        <div style={{ padding: 12, backgroundColor: '#2a2a2a', borderRadius: 4 }} data-locale={globals.locale}>
          <p style={{ margin: 0, fontSize: 14, color: '#ccc' }}>{message}</p>
        </div>
      </LoadingContainer>
    );
  },
};

export const QuickLoad: Story = {
  name: 'Quick Load (500ms delay)',
  args: {
    size: 'large',
    task: createDelayedTask(500),
  },
  render: (args, context) => {
    const { globals } = context;
    const message = resolveLocaleValue(globals.locale as string, loadedQuicklyMessage);
    return (
      <LoadingContainer {...args}>
        <div style={{ padding: 16, backgroundColor: '#2a2a2a', borderRadius: 4 }} data-locale={globals.locale}>
          <p style={{ margin: 0, color: '#ccc' }}>{message}</p>
        </div>
      </LoadingContainer>
    );
  },
};

export const LongLoad: Story = {
  name: 'Long Load (5s delay)',
  args: {
    size: 'large',
    task: createDelayedTask(5000),
  },
  render: (args, context) => {
    const { globals } = context;
    const heading = resolveLocaleValue(globals.locale as string, finallyLoadedMessage);
    const description = resolveLocaleValue(globals.locale as string, tookAWhileMessage);
    return (
      <LoadingContainer {...args}>
        <div style={{ padding: 16, backgroundColor: '#2a2a2a', borderRadius: 4 }} data-locale={globals.locale}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{heading}</h3>
          <p style={{ margin: 0, color: '#ccc' }}>{description}</p>
        </div>
      </LoadingContainer>
    );
  },
};

export const WithComplexContent: Story = {
  name: 'With Complex Content',
  args: {
    size: 'large',
    task: createDelayedTask(2000),
  },
  render: (args, context) => {
    const { globals } = context;
    const dashboard = resolveLocaleValue(globals.locale as string, userDashboardMessage);
    const username = resolveLocaleValue(globals.locale as string, usernameLabel);
    const level = resolveLocaleValue(globals.locale as string, levelLabel);
    const status = resolveLocaleValue(globals.locale as string, statusLabel);
    const online = resolveLocaleValue(globals.locale as string, onlineStatus);

    return (
      <LoadingContainer {...args}>
        <div style={{ padding: 16, backgroundColor: '#2a2a2a', borderRadius: 4 }} data-locale={globals.locale}>
          <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>{dashboard}</h3>
          <div style={{ marginBottom: 12 }}>
            <strong>{username}</strong> <span style={{ color: '#ccc' }}>PlayerOne</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong>{level}</strong> <span style={{ color: '#ccc' }}>42</span>
          </div>
          <div>
            <strong>{status}</strong> <span style={{ color: '#4caf50' }}>{online}</span>
          </div>
        </div>
      </LoadingContainer>
    );
  },
};

export const ErrorHandling: Story = {
  name: 'Error Handling (task fails)',
  args: {
    size: 'large',
    task: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Simulated task failure');
    },
  },
  render: (args, context) => {
    const { globals } = context;
    const message = resolveLocaleValue(globals.locale as string, errorDisplaysMessage);
    return (
      <LoadingContainer {...args}>
        <div style={{ padding: 16, backgroundColor: '#5a0a09', borderRadius: 4 }} data-locale={globals.locale}>
          <p style={{ margin: 0, color: '#ff9999' }}>{message}</p>
        </div>
      </LoadingContainer>
    );
  },
};

export const MultipleInstances: Story = {
  name: 'Multiple Instances',
  parameters: { layout: 'padded' },
  args: {
    task: createDelayedTask(1000),
    size: 'large',
  },
  render: (args, context) => {
    const { globals } = context;
    const large1s = resolveLocaleValue(globals.locale as string, largeSpinner1sLabel);
    const small2s = resolveLocaleValue(globals.locale as string, smallSpinner2sLabel);
    const large3s = resolveLocaleValue(globals.locale as string, largeSpinner3sLabel);
    const first = resolveLocaleValue(globals.locale as string, firstLoadedMessage);
    const second = resolveLocaleValue(globals.locale as string, secondLoadedMessage);
    const third = resolveLocaleValue(globals.locale as string, thirdLoadedMessage);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} data-locale={globals.locale}>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{large1s}</h4>
          <LoadingContainer size="large" task={createDelayedTask(1000)}>
            <div style={{ padding: 12, backgroundColor: '#2a2a2a', borderRadius: 4 }}>
              <p style={{ margin: 0, fontSize: 14, color: '#ccc' }}>{first}</p>
            </div>
          </LoadingContainer>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{small2s}</h4>
          <LoadingContainer size="small" task={createDelayedTask(2000)}>
            <div style={{ padding: 12, backgroundColor: '#2a2a2a', borderRadius: 4 }}>
              <p style={{ margin: 0, fontSize: 14, color: '#ccc' }}>{second}</p>
            </div>
          </LoadingContainer>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{large3s}</h4>
          <LoadingContainer size="large" task={createDelayedTask(3000)}>
            <div style={{ padding: 12, backgroundColor: '#2a2a2a', borderRadius: 4 }}>
              <p style={{ margin: 0, fontSize: 14, color: '#ccc' }}>{third}</p>
            </div>
          </LoadingContainer>
        </div>
      </div>
    );
  },
};

export default meta;
