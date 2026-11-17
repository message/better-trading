/**
 * Locale maps for strings shared by several stories (logo alt, modal close, header buttons...).
 * Mirrors the keys of `locales/en.yml`; consumed with `resolveLocaleValue`.
 */
import { defineMessages } from './locale-utils';

export const logoAltMessages = defineMessages({
  'en-US': 'Better Trading Logo',
  'fr-FR': 'Logo de Better Trading',
  'es-ES': 'Logotipo de Better Trading',
  'de-DE': 'Better-Trading-Logo',
  'pt-BR': 'Logotipo do Better Trading',
  'ru-RU': 'Логотип Better Trading',
  'zh-CN': 'Better Trading 标志',
  'ja-JP': 'Better Trading のロゴ',
  'ko-KR': 'Better Trading 로고',
  'th-TH': 'โลโก้ Better Trading',
});

export const modalCloseMessages = defineMessages({
  'en-US': 'Close',
  'fr-FR': 'Fermer',
  'es-ES': 'Cerrar',
  'de-DE': 'Schließen',
  'pt-BR': 'Fechar',
  'ru-RU': 'Закрыть',
  'zh-CN': '关闭',
  'ja-JP': '閉じる',
  'ko-KR': '닫기',
  'th-TH': 'ปิด',
});

export const headerCollapseMessages = defineMessages({
  'en-US': 'Collapse Better Trading panel',
  'fr-FR': 'Réduire le panneau Better Trading',
  'es-ES': 'Contraer el panel de Better Trading',
  'de-DE': 'Better-Trading-Bereich einklappen',
  'pt-BR': 'Recolher o painel do Better Trading',
  'ru-RU': 'Свернуть панель Better Trading',
  'zh-CN': '折叠 Better Trading 面板',
  'ja-JP': 'Better Trading パネルを折りたたむ',
  'ko-KR': 'Better Trading 패널 접기',
  'th-TH': 'ยุบแผง Better Trading',
});

export const headerExpandMessages = defineMessages({
  'en-US': 'Expand Better Trading panel',
  'fr-FR': 'Développer le panneau Better Trading',
  'es-ES': 'Expandir el panel de Better Trading',
  'de-DE': 'Better-Trading-Bereich ausklappen',
  'pt-BR': 'Expandir o painel do Better Trading',
  'ru-RU': 'Развернуть панель Better Trading',
  'zh-CN': '展开 Better Trading 面板',
  'ja-JP': 'Better Trading パネルを展開する',
  'ko-KR': 'Better Trading 패널 펼치기',
  'th-TH': 'ขยายแผง Better Trading',
});

export const headerShowAboutMessages = defineMessages({
  'en-US': 'Show details about Better Trading',
  'fr-FR': 'Afficher les détails de Better Trading',
  'es-ES': 'Mostrar detalles de Better Trading',
  'de-DE': 'Details zu Better Trading anzeigen',
  'pt-BR': 'Mostrar detalhes do Better Trading',
  'ru-RU': 'Показать сведения о Better Trading',
  'zh-CN': '显示 Better Trading 详情',
  'ja-JP': 'Better Trading の詳細を表示',
  'ko-KR': 'Better Trading 상세 정보 보기',
  'th-TH': 'แสดงรายละเอียดของ Better Trading',
});

export const headerShowMainMessages = defineMessages({
  'en-US': 'Show trading tools',
  'fr-FR': 'Afficher les outils de trade',
  'es-ES': 'Mostrar herramientas de comercio',
  'de-DE': 'Handelswerkzeuge anzeigen',
  'pt-BR': 'Mostrar ferramentas de troca',
  'ru-RU': 'Показать торговые инструменты',
  'zh-CN': '显示交易工具',
  'ja-JP': 'トレードツールを表示',
  'ko-KR': '거래 도구 보기',
  'th-TH': 'แสดงเครื่องมือซื้อขาย',
});

export const rootPageMenuLabelMessages = defineMessages({
  'en-US': 'Better Trading pages',
  'fr-FR': 'Pages de Better Trading',
  'es-ES': 'Páginas de Better Trading',
  'de-DE': 'Better-Trading-Seiten',
  'pt-BR': 'Páginas do Better Trading',
  'ru-RU': 'Страницы Better Trading',
  'zh-CN': 'Better Trading 页面',
  'ja-JP': 'Better Trading のページ',
  'ko-KR': 'Better Trading 페이지',
  'th-TH': 'หน้าของ Better Trading',
});

export const genericAlertMessages = defineMessages({
  'en-US': 'Oops! Something went wrong!',
  'fr-FR': 'Oups ! Une erreur est survenue !',
  'es-ES': '¡Vaya! Algo salió mal.',
  'de-DE': 'Hoppla! Etwas ist schiefgelaufen!',
  'pt-BR': 'Ops! Algo deu errado!',
  'ru-RU': 'Упс! Что-то пошло не так!',
  'zh-CN': '哎呀！出错了！',
  'ja-JP': 'おっと！問題が発生しました！',
  'ko-KR': '이런! 문제가 발생했습니다!',
  'th-TH': 'อุ๊ปส์! เกิดข้อผิดพลาดบางอย่าง!',
});

export const copyTradeSuccessMessages = defineMessages({
  'en-US': 'Trade URL for "{title}" has been copied to the clipboard.',
  'fr-FR': "L'URL de l'échange « {title} » a été copiée dans le presse-papiers.",
  'es-ES': 'La URL del intercambio "{title}" se ha copiado al portapapeles.',
  'de-DE': 'Die Handels-URL für „{title}“ wurde in die Zwischenablage kopiert.',
  'pt-BR': 'A URL da negociação "{title}" foi copiada para a área de transferência.',
  'ru-RU': 'Ссылка на обмен «{title}» скопирована в буфер обмена.',
  'zh-CN': '“{title}”的交易链接已复制到剪贴板。',
  'ja-JP': '「{title}」の取引 URL をクリップボードにコピーしました。',
  'ko-KR': '"{title}" 거래 URL이 클립보드에 복사되었습니다.',
  'th-TH': 'คัดลอก URL การซื้อขายของ "{title}" ไปยังคลิปบอร์ดแล้ว',
});
