import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Button } from 'datocms-react-ui';
import { useState } from 'react';
import ModelSelector from './ModelSelector';

export type Props = {
  ctx: RenderConfigScreenCtx;
};

type Parameters = {
  helpModels: string
}

export default function ConfigScreen({ ctx }: Props) {

  const parameters = ctx.plugin.attributes.parameters as Parameters;
  const [helpModels, setHelpModels] = useState<string | undefined>()

  const saveSettings: React.MouseEventHandler = (e) => {
    e.preventDefault()
    ctx.updatePluginParameters({ ...parameters, helpModels });
  }

  const hasChanged = JSON.stringify({ ...parameters, helpModels }) !== JSON.stringify(parameters)
  const currentHelpModels = ctx.plugin.attributes.parameters.helpModels ? JSON.parse(ctx.plugin.attributes.parameters.helpModels as string) : []

  return (
    <Canvas ctx={ctx}>
      <p>
        Help sections
        <ModelSelector
          currentUserAccessToken={ctx.currentUserAccessToken as string}
          currentValue={currentHelpModels}
          isMulti={true}
          onChange={(options) => { setHelpModels(JSON.stringify(options)) }}
        />
      </p>
      <br />
      <Button fullWidth disabled={!hasChanged} onClick={saveSettings}>Save settings</Button>
    </Canvas>
  );
}
