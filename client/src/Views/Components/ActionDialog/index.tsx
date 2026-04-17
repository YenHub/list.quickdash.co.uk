import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { type FC } from 'react'

interface Props {
  open: boolean
  title: string
  message?: string
  onAccept?: () => void | Promise<void>
  onCancel?(): void
  children?: React.ReactNode
}

const ActionDialog: FC<Props> = ({
  open,
  title,
  message,
  onAccept,
  onCancel,
  children,
}) => {
  const handleClose = (accept: boolean) => {
    if (accept) void onAccept?.()
    else onCancel?.()
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
          {onCancel && (
            <Button
              data-testid="action-dialog-cancel"
              onClick={onCancel}
              color="primary"
            >
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
