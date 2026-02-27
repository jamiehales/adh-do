import { useState } from 'react'
import { Box, Card, CardContent, Chip, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import type { Todo, UserId } from '../types'
import { requestUpdate } from '../api/updateRequests'

interface Props {
  todos: Todo[]
  otherUser: UserId
  loading: boolean
  currentUser: UserId
  pendingRequestedTodoIds: number[]
  onRequestSent: () => void
}

export default function AskForUpdateList({ todos, otherUser, loading, currentUser, pendingRequestedTodoIds, onRequestSent }: Props) {
  const [requesting, setRequesting] = useState<number | null>(null)

  const handleRequest = async (todoId: number) => {
    setRequesting(todoId)
    try {
      await requestUpdate(todoId, currentUser)
      onRequestSent()
    } finally {
      setRequesting(null)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}
      >
        {otherUser}'s tasks
      </Typography>

      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={24} sx={{ color: 'primary.light' }} />
          </Box>
        ) : todos.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={3}>
            {otherUser} has nothing to do right now!
          </Typography>
        ) : (
          todos.map(todo => {
            const isPending = pendingRequestedTodoIds.includes(todo.id)
            const isRequesting = requesting === todo.id

            return (
              <Card
                key={todo.id}
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                  borderRadius: '0.875rem',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(167, 139, 250, 0.5)',
                    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ py: '0.875rem !important', px: '1.25rem !important' }}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={todo.dueDate ? 0.5 : 0}>
                        {todo.importance && (
                          <Chip
                            label={todo.importance}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(124, 58, 237, 0.2)',
                              color: 'primary.light',
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              height: 20,
                            }}
                          />
                        )}
                        <Typography variant="body1" fontWeight={600}>
                          {todo.title}
                        </Typography>
                      </Box>
                      {todo.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                          Due {new Date(todo.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>

                    <Tooltip title={isPending ? 'Waiting for update…' : 'Request an update'}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={isPending || isRequesting}
                          onClick={() => handleRequest(todo.id)}
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: '0.85rem',
                            color: isPending ? 'text.disabled' : 'primary.light',
                            border: '1px solid',
                            borderColor: isPending ? 'rgba(167,139,250,0.15)' : 'rgba(167,139,250,0.4)',
                            borderRadius: '50%',
                            flexShrink: 0,
                            transition: 'all 0.2s',
                            '&:hover:not(:disabled)': {
                              bgcolor: 'rgba(124,58,237,0.1)',
                              borderColor: 'primary.light',
                            },
                          }}
                        >
                          {isPending ? '⏳' : isRequesting ? '…' : '?'}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            )
          })
        )}
      </Box>
    </Box>
  )
}
