import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import type { Todo } from '../types'
import { dismissCompletion } from '../api/todos'
import AppModal from './AppModal'

interface Props {
  todo: Todo
  onDismissed: () => void
  onClose: () => void
}

export default function CompletionNotificationModal({ todo, onDismissed, onClose }: Props) {
  const [dismissing, setDismissing] = useState(false)

  const handleOk = async () => {
    setDismissing(true)
    try {
      await dismissCompletion(todo.id)
      onDismissed()
    } finally {
      setDismissing(false)
    }
  }

  return (
    <AppModal
      onClose={onClose}
      borderColor="rgba(74, 222, 128, 0.25)"
      titleAlign="flex-start"
      title={
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'rgba(74, 222, 128, 0.15)',
              border: '1.5px solid rgba(74, 222, 128, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            ✓
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Task completed!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Goooooo {todo.ownerId}! (Remember to thank them!)
            </Typography>
          </Box>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
        <Box
          sx={{
            bgcolor: 'rgba(74, 222, 128, 0.06)',
            border: '1px solid rgba(74, 222, 128, 0.2)',
            borderRadius: '0.875rem',
            p: 2,
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            {todo.title}
          </Typography>
          {todo.completedAt && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Completed {new Date(todo.completedAt).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleOk}
            disabled={dismissing}
            sx={{
              borderRadius: '100px',
              fontWeight: 700,
              px: 3,
              bgcolor: 'rgba(74, 222, 128, 0.2)',
              color: 'success.light',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'rgba(74, 222, 128, 0.3)',
                boxShadow: 'none',
              },
            }}
          >
            OK
          </Button>
        </Box>
      </Box>
    </AppModal>
  )
}
