import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import type { PendingUpdateRequest } from '../types'
import { respondToUpdateRequest } from '../api/updateRequests'
import AppModal from './AppModal'

interface Props {
  request: PendingUpdateRequest
  onDone: () => void
  onClose: () => void
}

export default function RespondToUpdateModal({ request, onDone, onClose }: Props) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await respondToUpdateRequest(request.id, text.trim())
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppModal
      onClose={onClose}
      titleAlign="flex-start"
      title={
        <Box>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            How's it going?
          </Typography>
          <Typography variant="h4" color="primary.light" fontWeight={600}>
            {request.todoTitle}
          </Typography>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <Typography variant="body1" color="text.secondary" lineHeight={1.3}>
          Is there anything blocking this task that you need help with, or any updates?
        </Typography>

        <TextField
          multiline
          minRows={3}
          placeholder="Type your update here…"
          value={text}
          onChange={e => setText(e.target.value)}
          fullWidth
          autoFocus
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem',
              '& fieldset': { borderColor: 'rgba(167, 139, 250, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(167, 139, 250, 0.6)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            sx={{
              borderRadius: '100px',
              fontWeight: 700,
              px: 3,
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                opacity: 0.92,
              },
              '&.Mui-disabled': {
                background: 'rgba(124, 58, 237, 0.3)',
                color: 'rgba(255,255,255,0.4)',
              },
            }}
          >
            {submitting ? 'Sending…' : 'Send Update'}
          </Button>
        </Box>
      </Box>
    </AppModal>
  )
}
