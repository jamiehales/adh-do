import { useState } from 'react'
import {
  Box, Button, FormControlLabel, Radio, RadioGroup, TextField, Typography,
} from '@mui/material'
import { createTodo } from '../api/todos'
import { IMPORTANCE_LEVELS } from '../types'
import type { UserId } from '../types'
import AppModal from './AppModal'

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
    <AppModal
      open={open}
      onClose={handleClose}
      title={<Typography variant="h6" fontWeight={700}>Make a request of {otherUser}</Typography>}
    >
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

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    </AppModal>
  )
}
