import s from './MemberApproval.module.scss'
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Spinner } from 'datocms-react-ui';
import { useEffect, useState } from 'react';
import { siteUrl } from '../utils';
import { config } from 'process';

const approvalEndpoint = `${siteUrl}/api/auth/approve`

export type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function MemberApproval({ ctx }: PropTypes) {

  const { basicAuthPassword, basicAuthUsername } = ctx.parameters
  const [approved, setApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const approveApplication = async () => {

    try {
      setLoading(true)
      setError(undefined)

      console.log(basicAuthPassword, basicAuthUsername)

      const formData = { ...ctx.formValues }
      console.log('Authorization', 'Basic ' + btoa(basicAuthUsername + ":" + basicAuthPassword));

      const res = await fetch(approvalEndpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Basic ' + btoa(basicAuthUsername + ":" + basicAuthPassword)
        }
      })

      const body = await res.json()

      if (res.status !== 200)
        throw new Error('Server error: ' + body.error)

      await ctx.setFieldValue(ctx.field.attributes.api_key as string, true)
      await ctx.saveCurrentItem()
      setLoading(false)

    } catch (err) {

      setError(err as Error)
      setLoading(false)
    }
  }

  useEffect(() => {
    setApproved(ctx.formValues[ctx.field.attributes.api_key] as boolean)
  }, [ctx.formValues, ctx.field])

  return (
    <Canvas ctx={ctx}>
      <div className={s.container}>
        <strong>{approved ? 'Godkänd' : 'Ej godkänd'}</strong>
        <p>
          {approved ?
            <>
              Ansökan är godkänd
            </>
            :
            <>
              Genom att klicka på knappen nedan godkänns ansökan
              och medlemmen skickas ett e-mail med instruktioner
              för att skapa sitt konto och portfolio.
            </>
          }
        </p>

        <Button fullWidth disabled={loading} onClick={approveApplication}>
          {!loading ? 'Godkänn ansökan' : <Spinner />}
        </Button>

        {error &&
          <p className={s.error}>
            Error: {error.message}
          </p>
        }
      </div>
    </Canvas>
  )

}