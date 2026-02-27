import { Box, Card, CardActionArea, CardContent, Chip, CircularProgress, Typography } from '@mui/material'
import type { Todo, UserId } from '../types'

interface Props {
  todos: Todo[]
  otherUser: UserId
  loading: boolean
}

export default function AskForUpdateList({ todos, otherUser, loading }: Props) {
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
          todos.map(todo => (
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
              <CardActionArea sx={{ borderRadius: '0.875rem' }}>
                <CardContent sx={{ py: '0.875rem !important', px: '1.25rem !important' }}>
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
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        )}
      </Box>
    </Box>
  )
}
