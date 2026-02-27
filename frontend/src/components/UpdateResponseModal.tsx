import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import type { UpdateResponse } from '../types'
import { dismissUpdateResponse } from '../api/updateRequests'
import AppModal from './AppModal'

interface Props {
  response: UpdateResponse
  onDismissed: () => void
  onClose: () => void
}

export default function UpdateResponseModal({ response, onDismissed, onClose }: Props) {
  const [dismissing, setDismissing] = useState(false)

  const handleOk = async () => {
    setDismissing(true)
    try {
      await dismissUpdateResponse(response.id)
      onDismissed()
    } finally {
      setDismissing(false)
    }
  }

  return (
    <AppModal
      onClose={onClose}
      title={
        <Box>
          <Typography variant="h6" fontWeight={700} mb={0.25}>
            Update received
          </Typography>
          <Typography variant="body2" color="primary.light" fontWeight={600}>
            "{response.todoTitle}"
          </Typography>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
        <Box
          sx={{
            bgcolor: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: '0.875rem',
            p: 2,
          }}
        >
          <Typography variant="body1" lineHeight={1.6}>
            {response.response}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {new Date(response.respondedAt).toLocaleString()}
          </Typography>
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
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                opacity: 0.92,
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
