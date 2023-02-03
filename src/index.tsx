import React from 'react'
import ReactDOM from 'react-dom'
import { connect, IntentCtx, RenderFieldExtensionCtx, ItemType, InitPropertiesAndMethods, RenderItemFormSidebarPanelCtx } from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import RegionField from './entrypoints/RegionField'
import ModelSelectorField from './entrypoints/ModelSelectorField'
import HelpSidebar from './entrypoints/HelpSidebar'
import MemberApproval from './entrypoints/MemberApproval'
import type { ModelOption } from './entrypoints/ModelSelector';
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
        return ctx.itemStatus === 'published' ? render(<MemberApproval ctx={ctx} />) : null;
      case 'model-selector':
        return render(<ModelSelectorField ctx={ctx} />);
    }
  },
  itemFormSidebarPanels(itemType: ItemType, ctx: InitPropertiesAndMethods) {
    const helpModels = ctx.plugin.attributes.parameters.helpModels as string;
    if (!helpModels)
      return []

    const activeHelpModels = (JSON.parse(helpModels) as ModelOption[])
    if (!activeHelpModels.find(({ value }) => value === itemType.attributes.api_key))
      return []

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
