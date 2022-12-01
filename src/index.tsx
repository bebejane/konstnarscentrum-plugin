import { connect, IntentCtx, RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import RegionField from './entrypoints/RegionField'
import MemberApproval from './entrypoints/MemberApproval'
import 'datocms-react-ui/styles.css';
import { isDev } from './utils'

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions(ctx: IntentCtx) {
    return [
      {
        id: 'region-field',
        name: 'Region Field' + (isDev ? ' (dev)' : ''),
        type: 'editor',
        fieldTypes: ['link'],
        configurable: false
      },
      {
        id: 'member-approval',
        name: 'Member approval' + (isDev ? ' (dev)' : ''),
        type: 'editor',
        fieldTypes: ['boolean'],
        configurable: false
      },
    ];
  },

  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'region-field':
        return render(<RegionField ctx={ctx} />);
      case 'member-approval':
        return render(<MemberApproval ctx={ctx} />);
    }
  }
});
