import { useState } from 'react'
import { Box, Card, CardContent, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material'
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
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={24} sx={{ color: 'primary.light' }} />
          </Box>
        ) : todos.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={3}>
            There's nothing on {otherUser}'s list right now!
          </Typography>
        ) : (
          todos.map(todo => {
            const isPending = pendingRequestedTodoIds.includes(todo.id)
            const isRequesting = requesting === todo.id

            return (
              <Stack key={todo.id} direction="row" alignItems="center" spacing={1}>
                <Card
                  elevation={0}
                  sx={{
                    flex: 1,
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
                    <Typography variant="body1" fontWeight={600}>
                      {todo.title}
                    </Typography>
                  </CardContent>
                </Card>

                <Tooltip title={isPending ? 'Waiting for update…' : 'Request an update'}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={isPending || isRequesting}
                      onClick={() => handleRequest(todo.id)}
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: '0.8rem',
                        flexShrink: 0,
                        color: isPending ? 'text.disabled' : 'primary.light',
                        border: '1px solid',
                        borderColor: isPending ? 'rgba(167,139,250,0.15)' : 'rgba(167,139,250,0.4)',
                        borderRadius: '50%',
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
              </Stack>
            )
          })
        )}
      </Stack>
    </Box>
  )
}
