import { useState } from 'react'
import {
  Box, Button, Dialog, DialogContent, DialogTitle,
  FormControlLabel, Radio, RadioGroup, TextField, Typography,
} from '@mui/material'
import { createTodo } from '../api/todos'
import { IMPORTANCE_LEVELS } from '../types'
import type { UserId } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  currentUser: UserId
  otherUser: UserId
  onCreated: () => void
}

export default function MakeRequestModal({ open, onClose, currentUser, otherUser, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [importance, setImportance] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    setTitle('')
    setImportance('')
    setDueDate('')
    onClose()
  }

  const handleSubmit = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await createTodo({
        title: title.trim(),
        importance: importance || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        ownerId: otherUser,
        requestedById: currentUser,
      })
      onCreated()
      handleClose()
    } finally {
      setSubmitting(false)
    }
  }

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0.75rem',
      '& fieldset': { borderColor: 'rgba(167, 139, 250, 0.3)' },
      '&:hover fieldset': { borderColor: 'rgba(167, 139, 250, 0.6)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h6" fontWeight={700}>
          Make a request of {otherUser}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>

          {/* Title */}
          <TextField
            label="What do you need?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            autoFocus
            required
            sx={fieldSx}
          />

          {/* Importance */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.75} fontWeight={600}>
              How important is this?
            </Typography>
            <RadioGroup value={importance} onChange={e => setImportance(e.target.value)}>
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label={<Typography variant="body2" color="text.secondary">Just a thought (default)</Typography>}
              />
              {IMPORTANCE_LEVELS.map(level => (
                <FormControlLabel
                  key={level}
                  value={level}
                  control={<Radio size="small" />}
                  label={<Typography variant="body2">{level}</Typography>}
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Due date */}
          <TextField
            label="Due date (optional)"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleClose}
              sx={{ borderRadius: '100px', color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!title.trim() || submitting}
              sx={{
                borderRadius: '100px',
                fontWeight: 700,
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
              {submitting ? 'Sending…' : 'Send Request'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
