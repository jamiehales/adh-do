import { useState } from 'react'
import { Box, Card, CardContent, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import type { Todo } from '../types'
import { completeTodo } from '../api/todos'

interface Props {
  todos: Todo[]
  onCompleted: () => void
  onVolunteerUpdate: (todo: Todo) => void
}

export default function MyTodoList({ todos, onCompleted, onVolunteerUpdate }: Props) {
  const [completing, setCompleting] = useState<number | null>(null)

  if (todos.length === 0) return null

  const handleComplete = async (id: number) => {
    setCompleting(id)
    try {
      await completeTodo(id)
      onCompleted()
    } finally {
      setCompleting(null)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}
      >
        Your other tasks
      </Typography>

      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {todos.map(todo => (
          <Card
            key={todo.id}
            elevation={0}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              borderRadius: '0.875rem',
              transition: 'border-color 0.2s ease',
            }}
          >
            <CardContent sx={{ py: '0.875rem !important', px: '1.25rem !important' }}>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
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
                </Box>

                <Tooltip title="Send an update">
                  <IconButton
                    size="small"
                    onClick={() => onVolunteerUpdate(todo)}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.85rem',
                      color: 'primary.light',
                      border: '1.5px solid',
                      borderColor: 'rgba(167, 139, 250, 0.3)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(124, 58, 237, 0.1)',
                        borderColor: 'primary.light',
                      },
                    }}
                  >
                    💬
                  </IconButton>
                </Tooltip>

                <Tooltip title="Mark as done">
                  <IconButton
                    size="small"
                    disabled={completing === todo.id}
                    onClick={() => handleComplete(todo.id)}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '1rem',
                      color: 'success.light',
                      border: '1.5px solid',
                      borderColor: 'rgba(74, 222, 128, 0.4)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      '&:hover:not(:disabled)': {
                        bgcolor: 'rgba(74, 222, 128, 0.12)',
                        borderColor: 'success.light',
                      },
                    }}
                  >
                    {completing === todo.id ? '…' : '✓'}
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
