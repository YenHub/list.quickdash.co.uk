import { FC } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

interface Props {
  open: boolean
  title: string
  message: string
  onAccept?(): void
  onCancel?(): void
}

const ActionDialog: FC<Props> = ({
  open,
  title,
  message,
  onAccept,
  onCancel,
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
          <DialogContentText id="action-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {onCancel && (
            <Button data-testid="action-dialog-cancel" onClick={onCancel} color="primary">
              CANCEL
            </Button>
          )}
          <Button data-testid="action-dialog-accept" onClick={onAccept} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ActionDialog
