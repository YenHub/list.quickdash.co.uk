import { FC } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface Props {
  open: boolean
  title: string
  message?: string
  onAccept?(): void
  onCancel?(): void
  customHandler?: {
    action(): void
    message: string
    animateSuccess?: boolean
  }
  children?: React.ReactNode
}

const ActionDialog: FC<Props> = ({
  open,
  title,
  message,
  onAccept,
  onCancel,
  customHandler,
  children,
}) => {
  const handleClose = (accept: boolean) => {
    if (accept) {
      onAccept && onAccept()
    } else {
      onCancel && onCancel()
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        <DialogTitle id="action-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {children && children}
          {message && (
            <DialogContentText id="action-dialog-description">
              {message}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {customHandler && (
            <Button
              data-testid="action-dialog-custom"
              onClick={customHandler.action}
              color="primary"
            >
              {customHandler.message}
            </Button>
          )}
          {onCancel && (
            <Button data-testid="action-dialog-cancel" onClick={onCancel} color="primary">
              CANCEL
            </Button>
          )}
          <Button
            data-testid="action-dialog-accept"
            onClick={onAccept}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ActionDialog
