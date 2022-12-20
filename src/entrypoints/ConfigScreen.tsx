import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, TextField } from 'datocms-react-ui';
import { useState } from 'react';
import ModelSelector from './ModelSelector';

export type Props = {
  ctx: RenderConfigScreenCtx;
};

type Parameters = {
  helpModels: string,
  basicAuthUsername: string,
  basicAuthPassword: string,
}

export default function ConfigScreen({ ctx }: Props) {

  const parameters = ctx.plugin.attributes.parameters as Parameters;
  const [helpModels, setHelpModels] = useState<string | undefined>()
  const [basicAuthPassword, setBasicAuthPassword] = useState<string | undefined>();
  const [basicAuthUsername, setBasicAuthUsername] = useState<string | undefined>();

  const saveSettings: React.MouseEventHandler = (e) => {
    e.preventDefault()
    ctx.updatePluginParameters({ ...parameters, helpModels, basicAuthPassword, basicAuthUsername });
  }

  const hasChanged = JSON.stringify({ ...parameters, helpModels, basicAuthPassword, basicAuthUsername }) !== JSON.stringify(parameters)
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
      <p>
        <TextField
          id="basicAuthUsername"
          label="Username"
          name="basicAuthUsername"
          value={basicAuthUsername}
          onChange={(val) => setBasicAuthUsername(val as string)}
        />
        <TextField
          id="basicAuthPassword"
          label="Password"
          name="basicAuthPassword"
          value={basicAuthPassword}
          onChange={(val) => setBasicAuthPassword(val as string)}
        />
      </p>
      <br />
      <Button fullWidth disabled={!hasChanged} onClick={saveSettings}>Save settings</Button>
    </Canvas>
  );
}
