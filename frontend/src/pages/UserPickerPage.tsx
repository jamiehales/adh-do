import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'

const COOKIE_NAME = 'adh_do_user'
const VALID_USERS = ['Jamie', 'Ellie']

function getCookieUser(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)adh_do_user=([^;]+)/)
  return match ? match[1] : null
}

export function setUserCookie(userId: string) {
  document.cookie = `${COOKIE_NAME}=${userId}; path=/; max-age=${60 * 60 * 24 * 365}`
}

export function clearUserCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}

const users = [
  { id: 'Jamie', emoji: '🙋' },
  { id: 'Ellie', emoji: '🙋‍♀️' },
]

export default function UserPickerPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const saved = getCookieUser()
    if (saved && VALID_USERS.includes(saved)) {
      navigate(`/home/${saved}`, { replace: true })
    }
  }, [navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 4,
        gap: '3.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
      }}
    >
      {/* Hero — identical to the original welcome page */}
      <Box component="header" sx={{ textAlign: 'center', maxWidth: 560 }}>
        <Box
          sx={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            mb: '1.25rem',
          }}
        >
          <Box component="span" sx={{ color: 'primary.light' }}>ADH</Box>
          <Box component="span" sx={{ color: 'text.secondary' }}>-</Box>
          <Box component="span" sx={{ color: 'text.primary' }}>Do</Box>
          <Box component="span" sx={{ color: 'secondary.main' }}> ✓</Box>
        </Box>
        <Typography sx={{ fontSize: '1.125rem', color: 'text.secondary', lineHeight: 1.75 }}>
          A to-do app designed for brains that work differently.
          <br />
          <Box component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Together, one task at a time.
          </Box>
        </Typography>
      </Box>

      {/* User picker */}
      <Box>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          mb={2.5}
          fontWeight={500}
        >
          Who are you?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {users.map(({ id, emoji }) => (
            <Card
              key={id}
              elevation={0}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid rgba(167, 139, 250, 0.2)',
                borderRadius: '1rem',
                width: 160,
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'rgba(167, 139, 250, 0.5)',
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
                },
              }}
            >
              <CardActionArea
                onClick={() => { setUserCookie(id); navigate(`/home/${id}`) }}
                sx={{ borderRadius: '1rem' }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography sx={{ fontSize: '2.5rem', mb: 1, lineHeight: 1 }}>{emoji}</Typography>
                  <Typography variant="h6" fontWeight={700}>{id}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
