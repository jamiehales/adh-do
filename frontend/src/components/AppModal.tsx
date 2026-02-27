import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'

interface Props {
  open?: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  borderColor?: string
  titleAlign?: 'center' | 'flex-start'
}

export default function AppModal({
  open = true,
  onClose,
  title,
  children,
  borderColor = 'rgba(167, 139, 250, 0.2)',
  titleAlign = 'center',
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            border: `1px solid ${borderColor}`,
            borderRadius: '1.25rem',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: titleAlign, justifyContent: 'space-between', pb: 0 }}>
        {title}
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary', flexShrink: 0 }}>
          ✕
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
