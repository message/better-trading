import MarkdownChangelog from './index.tsx';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * MarkdownChangelog renders markdown content with styled headings, lists, links, and paragraphs.
 *
 * Uses the `marked` library to parse markdown into HTML, then renders it via `dangerouslySetInnerHTML`.
 * Only pass trusted markdown content.
 */
const meta = {
  component: MarkdownChangelog,
  title: 'Components/MarkdownChangelog',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    markdown: {
      control: false,
      description: '(Derived from locale in render).',
    },
  },
  // Provide placeholder markdown to satisfy required prop typing; real value set in render.
  args: { markdown: '' },
} satisfies Meta<typeof MarkdownChangelog>;

type Story = StoryObj<typeof meta>;

// Basic changelog with headings and lists
const basicChangelogMarkdown = defineMessages({
  'en-US': `# Version 2.0.0

## New Features
- Added dark mode support
- Improved search functionality
- Enhanced performance

## Bug Fixes
- Fixed login issue
- Resolved memory leak`,
  'fr-FR': `# Version 2.0.0

## Nouvelles fonctionnalités
- Ajout du mode sombre
- Amélioration de la recherche
- Performances améliorées

## Corrections de bugs
- Problème de connexion corrigé
- Fuite mémoire résolue`,
  'es-ES': `# Versión 2.0.0

## Nuevas características
- Soporte de modo oscuro añadido
- Funcionalidad de búsqueda mejorada
- Rendimiento mejorado

## Corrección de errores
- Problema de inicio de sesión corregido
- Fuga de memoria resuelta`,
  'de-DE': `# Version 2.0.0

## Neue Funktionen
- Dunkelmodus-Unterstützung hinzugefügt
- Suchfunktion verbessert
- Leistung verbessert

## Fehlerbehebungen
- Anmeldeproblem behoben
- Speicherleck behoben`,
  'pt-BR': `# Versão 2.0.0

## Novos recursos
- Suporte ao modo escuro adicionado
- Funcionalidade de pesquisa melhorada
- Desempenho aprimorado

## Correções de bugs
- Problema de login corrigido
- Vazamento de memória resolvido`,
  'ru-RU': `# Версия 2.0.0

## Новые функции
- Добавлена поддержка тёмного режима
- Улучшен поиск
- Повышена производительность

## Исправления
- Исправлена проблема входа
- Устранена утечка памяти`,
  'zh-CN': `# 版本 2.0.0

## 新功能
- 添加了深色模式支持
- 改进了搜索功能
- 增强了性能

## 错误修复
- 修复了登录问题
- 解决了内存泄漏`,
  'ja-JP': `# バージョン 2.0.0

## 新機能
- ダークモード対応を追加
- 検索機能を改善
- パフォーマンスを向上

## バグ修正
- ログイン問題を修正
- メモリリークを解決`,
  'ko-KR': `# 버전 2.0.0

## 새로운 기능
- 다크 모드 지원 추가
- 검색 기능 개선
- 성능 향상

## 버그 수정
- 로그인 문제 해결
- 메모리 누수 해결`,
  'th-TH': `# เวอร์ชัน 2.0.0

## ฟีเจอร์ใหม่
- เพิ่มการรองรับโหมดมืด
- ปรับปรุงฟังก์ชันการค้นหา
- เพิ่มประสิทธิภาพ

## แก้ไขบั๊ก
- แก้ไขปัญหาการเข้าสู่ระบบ
- แก้ไขปัญหา memory leak`,
});

const Basic: Story = {
  render: (args, { globals }) => {
    const markdown = resolveLocaleValue(globals.locale as string, basicChangelogMarkdown);
    return <MarkdownChangelog {...args} markdown={markdown} data-locale={globals.locale} />;
  },
};

// Changelog with links
const changelogWithLinksMarkdown = defineMessages({
  'en-US': `# Version 3.1.0

## Improvements
- Updated documentation - [Read more](https://example.com/docs)
- See [GitHub Issue #123](https://github.com/example/repo/issues/123) for details

## Notes
For more information, visit our [website](https://example.com).`,
  'fr-FR': `# Version 3.1.0

## Améliorations
- Documentation mise à jour - [En savoir plus](https://example.com/docs)
- Voir [GitHub Issue #123](https://github.com/example/repo/issues/123) pour plus de détails

## Remarques
Pour plus d'informations, visitez notre [site web](https://example.com).`,
  'es-ES': `# Versión 3.1.0

## Mejoras
- Documentación actualizada - [Leer más](https://example.com/docs)
- Ver [GitHub Issue #123](https://github.com/example/repo/issues/123) para más detalles

## Notas
Para más información, visita nuestro [sitio web](https://example.com).`,
  'de-DE': `# Version 3.1.0

## Verbesserungen
- Dokumentation aktualisiert - [Mehr erfahren](https://example.com/docs)
- Siehe [GitHub Issue #123](https://github.com/example/repo/issues/123) für Details

## Hinweise
Weitere Informationen finden Sie auf unserer [Website](https://example.com).`,
  'pt-BR': `# Versão 3.1.0

## Melhorias
- Documentação atualizada - [Saiba mais](https://example.com/docs)
- Veja [GitHub Issue #123](https://github.com/example/repo/issues/123) para detalhes

## Notas
Para mais informações, visite nosso [site](https://example.com).`,
  'ru-RU': `# Версия 3.1.0

## Улучшения
- Обновлена документация - [Подробнее](https://example.com/docs)
- См. [GitHub Issue #123](https://github.com/example/repo/issues/123) для деталей

## Примечания
Для получения дополнительной информации посетите наш [сайт](https://example.com).`,
  'zh-CN': `# 版本 3.1.0

## 改进
- 更新了文档 - [阅读更多](https://example.com/docs)
- 查看 [GitHub Issue #123](https://github.com/example/repo/issues/123) 了解详情

## 注意事项
有关更多信息，请访问我们的[网站](https://example.com)。`,
  'ja-JP': `# バージョン 3.1.0

## 改善
- ドキュメントを更新 - [詳細を読む](https://example.com/docs)
- 詳細については [GitHub Issue #123](https://github.com/example/repo/issues/123) をご覧ください

## 注意事項
詳細については、当社の[ウェブサイト](https://example.com)をご覧ください。`,
  'ko-KR': `# 버전 3.1.0

## 개선사항
- 문서 업데이트 - [자세히 보기](https://example.com/docs)
- 자세한 내용은 [GitHub Issue #123](https://github.com/example/repo/issues/123)을 참조하세요

## 참고사항
자세한 내용은 [웹사이트](https://example.com)를 방문하세요.`,
  'th-TH': `# เวอร์ชัน 3.1.0

## การปรับปรุง
- อัปเดตเอกสาร - [อ่านเพิ่มเติม](https://example.com/docs)
- ดู [GitHub Issue #123](https://github.com/example/repo/issues/123) สำหรับรายละเอียด

## หมายเหตุ
สำหรับข้อมูลเพิ่มเติม โปรดเยี่ยมชม[เว็บไซต์](https://example.com)ของเรา`,
});

const WithLinks: Story = {
  name: 'With Links',
  render: (args, { globals }) => {
    const markdown = resolveLocaleValue(globals.locale as string, changelogWithLinksMarkdown);
    return <MarkdownChangelog {...args} markdown={markdown} data-locale={globals.locale} />;
  },
};

// Complex changelog with paragraphs
const complexChangelogMarkdown = defineMessages({
  'en-US': `# Version 4.0.0 - Major Release

This release includes breaking changes. Please read the migration guide carefully.

## Breaking Changes
- Removed deprecated API endpoints
- Changed authentication flow

## New Features
- Real-time collaboration support
- Advanced filtering options
- Customizable themes

The new theme system allows users to create their own color schemes.

## Performance
- 50% faster load times
- Reduced memory usage by 30%

We've optimized the core engine for better performance across all devices.`,
  'fr-FR': `# Version 4.0.0 - Version majeure

Cette version inclut des changements incompatibles. Veuillez lire attentivement le guide de migration.

## Changements incompatibles
- Suppression des points de terminaison API obsolètes
- Modification du flux d'authentification

## Nouvelles fonctionnalités
- Support de la collaboration en temps réel
- Options de filtrage avancées
- Thèmes personnalisables

Le nouveau système de thèmes permet aux utilisateurs de créer leurs propres schémas de couleurs.

## Performances
- Temps de chargement 50 % plus rapides
- Utilisation de la mémoire réduite de 30 %

Nous avons optimisé le moteur principal pour de meilleures performances sur tous les appareils.`,
  'es-ES': `# Versión 4.0.0 - Lanzamiento importante

Esta versión incluye cambios incompatibles. Lea la guía de migración cuidadosamente.

## Cambios incompatibles
- Eliminados endpoints de API obsoletos
- Flujo de autenticación modificado

## Nuevas características
- Soporte de colaboración en tiempo real
- Opciones de filtrado avanzadas
- Temas personalizables

El nuevo sistema de temas permite a los usuarios crear sus propios esquemas de color.

## Rendimiento
- Tiempos de carga 50% más rápidos
- Uso de memoria reducido en un 30%

Hemos optimizado el motor principal para un mejor rendimiento en todos los dispositivos.`,
  'de-DE': `# Version 4.0.0 - Hauptversion

Diese Version enthält Breaking Changes. Bitte lesen Sie die Migrationsanleitung sorgfältig durch.

## Breaking Changes
- Veraltete API-Endpunkte entfernt
- Authentifizierungsfluss geändert

## Neue Funktionen
- Echtzeit-Kollaborationsunterstützung
- Erweiterte Filteroptionen
- Anpassbare Themes

Das neue Theme-System ermöglicht Benutzern die Erstellung eigener Farbschemata.

## Leistung
- 50 % schnellere Ladezeiten
- Speicherverbrauch um 30 % reduziert

Wir haben den Kern-Engine für bessere Leistung auf allen Geräten optimiert.`,
  'pt-BR': `# Versão 4.0.0 - Lançamento importante

Esta versão inclui mudanças incompatíveis. Leia o guia de migração cuidadosamente.

## Mudanças incompatíveis
- Removidos endpoints de API obsoletos
- Alterado fluxo de autenticação

## Novos recursos
- Suporte para colaboração em tempo real
- Opções de filtragem avançadas
- Temas personalizáveis

O novo sistema de temas permite que os usuários criem seus próprios esquemas de cores.

## Desempenho
- Tempos de carregamento 50% mais rápidos
- Uso de memória reduzido em 30%

Otimizamos o motor principal para melhor desempenho em todos os dispositivos.`,
  'ru-RU': `# Версия 4.0.0 - Основной релиз

Этот релиз включает критические изменения. Внимательно прочитайте руководство по миграции.

## Критические изменения
- Удалены устаревшие конечные точки API
- Изменён поток аутентификации

## Новые функции
- Поддержка совместной работы в реальном времени
- Расширенные параметры фильтрации
- Настраиваемые темы

Новая система тем позволяет пользователям создавать собственные цветовые схемы.

## Производительность
- Время загрузки быстрее на 50%
- Использование памяти снижено на 30%

Мы оптимизировали основной движок для повышения производительности на всех устройствах.`,
  'zh-CN': `# 版本 4.0.0 - 重大发布

此版本包含破坏性更改。请仔细阅读迁移指南。

## 破坏性更改
- 删除了已弃用的 API 端点
- 更改了身份验证流程

## 新功能
- 实时协作支持
- 高级过滤选项
- 可自定义主题

新的主题系统允许用户创建自己的配色方案。

## 性能
- 加载时间缩短 50%
- 内存使用减少 30%

我们优化了核心引擎，以在所有设备上获得更好的性能。`,
  'ja-JP': `# バージョン 4.0.0 - メジャーリリース

このリリースには破壊的変更が含まれています。移行ガイドを注意深くお読みください。

## 破壊的変更
- 非推奨のAPIエンドポイントを削除
- 認証フローを変更

## 新機能
- リアルタイムコラボレーション対応
- 高度なフィルタリングオプション
- カスタマイズ可能なテーマ

新しいテーマシステムにより、ユーザーは独自のカラースキームを作成できます。

## パフォーマンス
- 読み込み時間が50%高速化
- メモリ使用量が30%削減

すべてのデバイスでのパフォーマンス向上のため、コアエンジンを最適化しました。`,
  'ko-KR': `# 버전 4.0.0 - 메이저 릴리스

이 릴리스에는 호환성을 깨는 변경사항이 포함되어 있습니다. 마이그레이션 가이드를 주의 깊게 읽어주세요.

## 호환성을 깨는 변경사항
- 더 이상 사용되지 않는 API 엔드포인트 제거
- 인증 플로우 변경

## 새로운 기능
- 실시간 협업 지원
- 고급 필터링 옵션
- 사용자 지정 가능한 테마

새로운 테마 시스템을 통해 사용자가 자신만의 색상 구성을 만들 수 있습니다.

## 성능
- 로드 시간 50% 단축
- 메모리 사용량 30% 감소

모든 기기에서 더 나은 성능을 위해 코어 엔진을 최적화했습니다.`,
  'th-TH': `# เวอร์ชัน 4.0.0 - การเผยแพร่หลัก

รุ่นนี้มีการเปลี่ยนแปลงที่ทำลายความเข้ากันได้ โปรดอ่านคู่มือการโยกย้ายอย่างระมัดระวัง

## การเปลี่ยนแปลงที่ทำลายความเข้ากันได้
- ลบ API endpoints ที่เลิกใช้แล้ว
- เปลี่ยนขั้นตอนการยืนยันตัวตน

## ฟีเจอร์ใหม่
- รองรับการทำงานร่วมกันแบบเรียลไทม์
- ตัวเลือกการกรองขั้นสูง
- ธีมที่ปรับแต่งได้

ระบบธีมใหม่ช่วยให้ผู้ใช้สร้างโทนสีของตัวเองได้

## ประสิทธิภาพ
- โหลดเร็วขึ้น 50%
- ลดการใช้หน่วยความจำ 30%

เราได้ปรับปรุงเอนจินหลักเพื่อประสิทธิภาพที่ดีขึ้นในทุกอุปกรณ์`,
});

const Complex: Story = {
  name: 'Complex Changelog',
  render: (args, { globals }) => {
    const markdown = resolveLocaleValue(globals.locale as string, complexChangelogMarkdown);
    return <MarkdownChangelog {...args} markdown={markdown} data-locale={globals.locale} />;
  },
};

// Simple single heading
const simpleHeadingMarkdown = defineMessages({
  'en-US': `# What's New

Check out the latest updates to Better Trading!`,
  'fr-FR': `# Quoi de neuf

Découvrez les dernières mises à jour de Better Trading !`,
  'es-ES': `# Novedades

¡Descubre las últimas actualizaciones de Better Trading!`,
  'de-DE': `# Was gibt's Neues

Schauen Sie sich die neuesten Updates von Better Trading an!`,
  'pt-BR': `# Novidades

Confira as últimas atualizações do Better Trading!`,
  'ru-RU': `# Что нового

Ознакомьтесь с последними обновлениями Better Trading!`,
  'zh-CN': `# 更新内容

查看 Better Trading 的最新更新！`,
  'ja-JP': `# 最新情報

Better Trading の最新アップデートをチェックしてください！`,
  'ko-KR': `# 새로운 소식

Better Trading의 최신 업데이트를 확인하세요!`,
  'th-TH': `# มีอะไรใหม่

ดูอัปเดตล่าสุดของ Better Trading!`,
});

const Simple: Story = {
  name: 'Simple Heading',
  render: (args, { globals }) => {
    const markdown = resolveLocaleValue(globals.locale as string, simpleHeadingMarkdown);
    return <MarkdownChangelog {...args} markdown={markdown} data-locale={globals.locale} />;
  },
};

export default meta;
export { Basic, WithLinks, Complex, Simple };
