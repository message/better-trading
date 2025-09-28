import Index from '../../app/components/button';

export default () => {
  return <div>{i18n.t('extension.name')} - {i18n.t('extension.description')}
  <Index onClick={() => alert(i18n.t('extension.name'))}>Click me</Index>
  </div>;
};