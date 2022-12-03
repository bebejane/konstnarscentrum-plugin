import React from 'react'
import ReactDOM from 'react-dom'
import { connect, IntentCtx, RenderFieldExtensionCtx, ItemType, InitPropertiesAndMethods, RenderItemFormSidebarPanelCtx } from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import RegionField from './entrypoints/RegionField'
import ModelSelector from './entrypoints/ModelSelector'
import HelpSidebar from './entrypoints/HelpSidebar'
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
      {
        id: 'model-selector',
        name: 'Model selector' + (isDev ? ' (dev)' : ''),
        type: 'editor',
        fieldTypes: ['string'],
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
      case 'model-selector':
        return render(<ModelSelector ctx={ctx} />);
    }
  },
  itemFormSidebarPanels(itemType: ItemType, ctx: InitPropertiesAndMethods) {
    return [
      {
        id: 'sidebarHelp',
        label: `Hjälp ${isDev ? ' (dev)' : ''}`,
        placement: ['before', 'actions'],
        startOpen: true,
      },
    ];
  },
  renderItemFormSidebarPanel(sidebarPanelId, ctx: RenderItemFormSidebarPanelCtx) {
    ReactDOM.render(
      <React.StrictMode>
        <HelpSidebar ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
