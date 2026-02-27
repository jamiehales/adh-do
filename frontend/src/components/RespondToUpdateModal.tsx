import { useState } from 'react'
import {
  Box, Button, Dialog, DialogContent, Typography, TextField,
} from '@mui/material'
import type { PendingUpdateRequest } from '../types'
import { respondToUpdateRequest } from '../api/updateRequests'

interface Props {
  request: PendingUpdateRequest
  onDone: () => void
}

export default function RespondToUpdateModal({ request, onDone }: Props) {
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
    <Dialog
      open
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          borderRadius: '1.25rem',
        },
      }}
    >
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} mb={0.5}>
              Update request
            </Typography>
            <Typography variant="body2" color="primary.light" fontWeight={600}>
              "{request.todoTitle}"
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
            {request.requestedByUserId} would love to know if there's anything blocking
            this task, or any updates?
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
      </DialogContent>
    </Dialog>
  )
}
