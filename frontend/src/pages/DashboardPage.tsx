import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button, Card, CardContent, Chip,
  CircularProgress, IconButton, Stack, Tooltip, Typography,
} from '@mui/material'
import { completeTodo, getCompletionsFor, getTodosForUser } from '../api/todos'
import {
  getPendingUpdateRequests,
  getUpdateResponses,
  getOutgoingRequestedTodoIds,
} from '../api/updateRequests'
import type { PendingUpdateRequest, Todo, UpdateResponse, UserId } from '../types'
import AppModal from '../components/AppModal'
import MakeRequestModal from '../components/MakeRequestModal'
import AskForUpdateList from '../components/AskForUpdateList'
import RespondToUpdateModal from '../components/RespondToUpdateModal'
import UpdateResponseModal from '../components/UpdateResponseModal'
import MyTodoList from '../components/MyTodoList'
import CompletionNotificationModal from '../components/CompletionNotificationModal'

const OTHER_USER: Record<string, UserId> = {
  Jamie: 'Ellie',
  Ellie: 'Jamie',
}

const buzzKeyframes = {
  '@keyframes buzz': {
    '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
    '20%': { transform: 'rotate(-8deg) scale(1.05)' },
    '40%': { transform: 'rotate(8deg) scale(1.05)' },
    '60%': { transform: 'rotate(-5deg) scale(1.02)' },
    '80%': { transform: 'rotate(5deg) scale(1.02)' },
  },
}

export default function DashboardPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  const otherUser = OTHER_USER[userId ?? ''] as UserId | undefined

  const [myTodos, setMyTodos] = useState<Todo[]>([])
  const [otherTodos, setOtherTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<number | null>(null)
  const [showAskForUpdate, setShowAskForUpdate] = useState(false)
  const [showMakeRequest, setShowMakeRequest] = useState(false)
  const [showMoreTasks, setShowMoreTasks] = useState(false)

  // Update request / completion notification state
  const [pendingRequests, setPendingRequests] = useState<PendingUpdateRequest[]>([])
  const [pendingResponses, setPendingResponses] = useState<UpdateResponse[]>([])
  const [completionNotifications, setCompletionNotifications] = useState<Todo[]>([])
  const [outgoingTodoIds, setOutgoingTodoIds] = useState<number[]>([])

  const [activeRequest, setActiveRequest] = useState<PendingUpdateRequest | null>(null)
  const [activeResponse, setActiveResponse] = useState<UpdateResponse | null>(null)
  const [activeCompletion, setActiveCompletion] = useState<Todo | null>(null)

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

  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    try {
      const [pending, responses, completions, outgoing] = await Promise.all([
        getPendingUpdateRequests(userId),
        getUpdateResponses(userId),
        getCompletionsFor(userId),
        getOutgoingRequestedTodoIds(userId),
      ])
      setPendingRequests(pending)
      setPendingResponses(responses)
      setCompletionNotifications(completions)
      setOutgoingTodoIds(outgoing)
    } catch {
      // silently ignore polling errors
    }
  }, [userId])

  useEffect(() => {
    if (!userId || !otherUser) {
      navigate('/')
      return
    }
    fetchTodos()
    fetchNotifications()
  }, [userId, otherUser, fetchTodos, fetchNotifications, navigate])

  // Poll every 8 seconds
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    pollRef.current = setInterval(fetchNotifications, 8000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [fetchNotifications])

  const topTask = myTodos[0] ?? null
  const remainingTasks = myTodos.slice(1)

  const handleCompleteTop = async () => {
    if (!topTask) return
    setCompleting(topTask.id)
    try {
      await completeTodo(topTask.id)
      await fetchTodos()
    } finally {
      setCompleting(null)
    }
  }

  // Badge slot positions (stack from bottom: 0 = lowest)
  const slots = {
    question: 0,
    ellipsis: pendingRequests.length > 0 ? 1 : 0,
    check: (pendingRequests.length > 0 ? 1 : 0) + (pendingResponses.length > 0 ? 1 : 0),
  }
  const badgeBottom = (slot: number) => 28 + slot * 64

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
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box flex={1}>
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
                </Box>

                <Tooltip title="Mark as done">
                  <IconButton
                    disabled={completing === topTask.id}
                    onClick={handleCompleteTop}
                    sx={{
                      width: 38,
                      height: 38,
                      fontSize: '1.1rem',
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
                    {completing === topTask.id ? '…' : '✓'}
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Typography color="text.secondary" textAlign="center" sx={{ width: '100%' }}>
                Nothing on your plate right now 🎉
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Remaining tasks */}
      {remainingTasks.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => setShowMoreTasks(v => !v)}
            sx={{ color: 'text.secondary', fontSize: '0.75rem', px: 0 }}
          >
            {showMoreTasks ? 'Show less' : `Show more`}
          </Button>
          {showMoreTasks && <MyTodoList todos={remainingTasks} onCompleted={fetchTodos} />}
        </Box>
      )}

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
          onClick={() => setShowAskForUpdate(true)}
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
          Ask for an Update
        </Button>
      </Stack>

      {/* Ask for an update modal */}
      {otherUser && userId && (
        <AppModal
          open={showAskForUpdate}
          onClose={() => setShowAskForUpdate(false)}
          title={<Typography variant="h6" fontWeight={700}>Ask for an update</Typography>}
        >
          <Box sx={{ pt: 1 }}>
            <AskForUpdateList
              todos={otherTodos}
              otherUser={otherUser}
              loading={loading}
              currentUser={userId as UserId}
              pendingRequestedTodoIds={outgoingTodoIds}
              onRequestSent={fetchNotifications}
            />
          </Box>
        </AppModal>
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

      {/* ? badge — someone wants an update from me */}
      {pendingRequests.length > 0 && (
        <Tooltip title={`${pendingRequests.length} update request${pendingRequests.length > 1 ? 's' : ''} pending`}>
          <Box
            onClick={() => setActiveRequest(pendingRequests[0])}
            sx={{
              position: 'fixed',
              bottom: badgeBottom(slots.question),
              right: 28,
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              animation: 'buzz 0.6s ease-in-out infinite',
              ...buzzKeyframes,
              '&:hover': { opacity: 0.9 },
            }}
          >
            <Typography sx={{ fontSize: '1.4rem', lineHeight: 1, color: '#fff', fontWeight: 700 }}>
              ?
            </Typography>
            {pendingRequests.length > 1 && (
              <Box sx={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', bgcolor: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{pendingRequests.length}</Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      )}

      {/* ... bubble — I got an update response */}
      {pendingResponses.length > 0 && (
        <Tooltip title={`${pendingResponses.length} update${pendingResponses.length > 1 ? 's' : ''} received`}>
          <Box
            onClick={() => setActiveResponse(pendingResponses[0])}
            sx={{
              position: 'fixed',
              bottom: badgeBottom(slots.ellipsis),
              right: 28,
              minWidth: 52,
              height: 52,
              px: 1.5,
              borderRadius: '26px',
              bgcolor: 'background.paper',
              border: '2px solid rgba(167, 139, 250, 0.5)',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              cursor: 'pointer',
              userSelect: 'none',
              animation: 'buzz 0.6s ease-in-out infinite',
              animationDelay: '0.15s',
              ...buzzKeyframes,
              '&:hover': { borderColor: 'primary.light' },
            }}
          >
            {[0, 1, 2].map(i => (
              <Box
                key={i}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  animation: 'dotBounce 1s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                  '@keyframes dotBounce': {
                    '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                    '40%': { transform: 'scale(1.2)', opacity: 1 },
                  },
                }}
              />
            ))}
            {pendingResponses.length > 1 && (
              <Box sx={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', bgcolor: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{pendingResponses.length}</Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      )}

      {/* ✓ badge — a task I requested was completed */}
      {completionNotifications.length > 0 && (
        <Tooltip title={`${completionNotifications.length} task${completionNotifications.length > 1 ? 's' : ''} completed`}>
          <Box
            onClick={() => setActiveCompletion(completionNotifications[0])}
            sx={{
              position: 'fixed',
              bottom: badgeBottom(slots.check),
              right: 28,
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: 'rgba(74, 222, 128, 0.15)',
              border: '2px solid rgba(74, 222, 128, 0.5)',
              boxShadow: '0 4px 20px rgba(74, 222, 128, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              animation: 'buzz 0.6s ease-in-out infinite',
              animationDelay: '0.3s',
              ...buzzKeyframes,
              '&:hover': { bgcolor: 'rgba(74, 222, 128, 0.22)' },
            }}
          >
            <Typography sx={{ fontSize: '1.3rem', lineHeight: 1, color: '#4ade80' }}>
              ✓
            </Typography>
            {completionNotifications.length > 1 && (
              <Box sx={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', bgcolor: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#fff', fontWeight: 700, lineHeight: 1 }}>{completionNotifications.length}</Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      )}

      {/* Respond to update request */}
      {activeRequest && (
        <RespondToUpdateModal
          request={activeRequest}
          onDone={() => { setActiveRequest(null); fetchNotifications() }}
          onClose={() => setActiveRequest(null)}
        />
      )}

      {/* View update response */}
      {activeResponse && (
        <UpdateResponseModal
          response={activeResponse}
          onDismissed={() => { setActiveResponse(null); fetchNotifications() }}
          onClose={() => setActiveResponse(null)}
        />
      )}

      {/* View completion notification */}
      {activeCompletion && (
        <CompletionNotificationModal
          todo={activeCompletion}
          onDismissed={() => { setActiveCompletion(null); fetchNotifications() }}
          onClose={() => setActiveCompletion(null)}
        />
      )}
    </Box>
  )
}
