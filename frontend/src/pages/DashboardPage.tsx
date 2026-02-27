import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Card, CardContent, Chip,
  CircularProgress, Stack, Typography,
} from '@mui/material'
import { getTodosForUser } from '../api/todos'
import type { Todo, UserId } from '../types'
import MakeRequestModal from '../components/MakeRequestModal'
import AskForUpdateList from '../components/AskForUpdateList'

const OTHER_USER: Record<string, UserId> = {
  Jamie: 'Ellie',
  Ellie: 'Jamie',
}

export default function DashboardPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  const otherUser = OTHER_USER[userId ?? ''] as UserId | undefined

  const [myTodos, setMyTodos] = useState<Todo[]>([])
  const [otherTodos, setOtherTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showAskForUpdate, setShowAskForUpdate] = useState(false)
  const [showMakeRequest, setShowMakeRequest] = useState(false)

  const fetchTodos = useCallback(async () => {
    if (!userId || !otherUser) return
    setLoading(true)
    try {
      const [mine, others] = await Promise.all([
        getTodosForUser(userId),
        getTodosForUser(otherUser),
      ])
      setMyTodos(mine)
      setOtherTodos(others)
    } finally {
      setLoading(false)
    }
  }, [userId, otherUser])

  useEffect(() => {
    if (!userId || !otherUser) {
      navigate('/')
      return
    }
    fetchTodos()
  }, [userId, otherUser, fetchTodos, navigate])

  const topTask = myTodos[0] ?? null

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 3,
        py: 4,
        gap: 3,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
      }}
    >
      {/* Header */}
      <Box sx={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          onClick={() => navigate('/')}
          sx={{ color: 'text.secondary', minWidth: 'auto', px: 1, borderRadius: '8px' }}
        >
          ←
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Hi, {userId} 👋
        </Typography>
      </Box>

      {/* "What's wanted from you most" card */}
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}
        >
          What is wanted from you the most
        </Typography>

        <Card
          elevation={0}
          sx={{
            mt: 1,
            bgcolor: 'background.paper',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: '1rem',
            minHeight: 110,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CardContent sx={{ width: '100%', p: '1.5rem !important' }}>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress size={24} sx={{ color: 'primary.light' }} />
              </Box>
            ) : topTask ? (
              <Box>
                {topTask.importance && (
                  <Chip
                    label={topTask.importance}
                    size="small"
                    sx={{
                      mb: 1,
                      bgcolor: 'rgba(124, 58, 237, 0.2)',
                      color: 'primary.light',
                      fontWeight: 600,
                      fontSize: '0.68rem',
                      height: 22,
                    }}
                  />
                )}
                <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
                  {topTask.title}
                </Typography>
                {topTask.dueDate && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Due {new Date(topTask.dueDate).toLocaleDateString()}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
                  Requested by {topTask.requestedById}
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary" textAlign="center" sx={{ width: '100%' }}>
                Nothing on your plate right now 🎉
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Action buttons */}
      <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 480 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setShowMakeRequest(true)}
          sx={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            borderRadius: '100px',
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
              opacity: 0.92,
              boxShadow: '0 8px 28px rgba(124, 58, 237, 0.5)',
            },
          }}
        >
          Make a Request
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => setShowAskForUpdate(v => !v)}
          sx={{
            borderRadius: '100px',
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
            borderColor: 'rgba(167, 139, 250, 0.4)',
            color: 'primary.light',
            '&:hover': {
              borderColor: 'primary.light',
              bgcolor: 'rgba(124, 58, 237, 0.08)',
            },
          }}
        >
          {showAskForUpdate ? 'Hide Update' : 'Ask for an Update'}
        </Button>
      </Stack>

      {/* Other user's todo list */}
      {showAskForUpdate && otherUser && (
        <AskForUpdateList todos={otherTodos} otherUser={otherUser} loading={loading} />
      )}

      {/* Make request modal */}
      {userId && otherUser && (
        <MakeRequestModal
          open={showMakeRequest}
          onClose={() => setShowMakeRequest(false)}
          currentUser={userId as UserId}
          otherUser={otherUser}
          onCreated={fetchTodos}
        />
      )}
    </Box>
  )
}
