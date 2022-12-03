import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, SelectField } from 'datocms-react-ui';
import { useEffect, useState } from 'react';
import { buildClient } from '@datocms/cma-client-browser';

export type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export type ModelOption = {
  label: string,
  value: string
}

export default function ModelSelector({ ctx }: PropTypes) {

  const [options, setOptions] = useState<ModelOption[] | undefined>()
  const [value, setValue] = useState<ModelOption | undefined>()
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {

    const client = buildClient({ apiToken: ctx.currentUserAccessToken as string })
    const currentValue = ctx.formValues[ctx.field.attributes.api_key];

    client.itemTypes.list().then((models) => {

      const options = models
        .filter(el => !el.modular_block)
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(({ api_key, name }) => ({ value: api_key as string, label: name as string }))

      setOptions(options)

      if (currentValue)
        setValue(options.find(({ value }) => value === currentValue))
      else {
        const roleName = ctx.currentRole.attributes.name.toLowerCase();
        setValue(options.find(({ value, label }) => label.toLowerCase() === roleName))
      }
    }).catch(err => setError(err))

  }, [setOptions])

  useEffect(() => {
    ctx.setFieldValue(ctx.field.attributes.api_key, value?.value)
  }, [value])

  return (
    <Canvas ctx={ctx}>
      <SelectField
        id="model"
        name="model"
        label=""
        value={value}
        selectInputProps={{ isMulti: false, options }}
        onChange={(newValue) => { setValue(newValue as ModelOption) }}
      />
      {error && <div>Error: {error.message}</div>}
    </Canvas>
  )

}