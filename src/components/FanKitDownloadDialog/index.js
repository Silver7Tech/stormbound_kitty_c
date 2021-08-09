import React from 'react'
import { useFela } from 'react-fela'
import Dialog from '../Dialog'

export default React.memo(function FanKitDownloadDialog(props) {
  const { css } = useFela()
  return (
    <Dialog
      id='fan-kit-dialog'
      dialogRef={props.dialogRef}
      close={props.close}
      title={props.name || 'Download image'}
      image={props.displayImage === false ? null : props.image}
      ctaProps={
        props.image
          ? {
              href: props.image,
              download: true,
              className: css({ minWidth: 0 }),
              'data-testid': 'fan-kit-link',
              children: 'PNG file',
            }
          : undefined
      }
    >
      {props.image ? (
        <p>
          <a href={props.image} target='_blank' rel='noopener noreferrer'>
            Open image in new tab
          </a>{' '}
          or download it as:
        </p>
      ) : (
        <p>An error has occurred.</p>
      )}
    </Dialog>
  )
})
