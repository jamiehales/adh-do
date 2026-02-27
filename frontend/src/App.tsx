import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'

const features = [
  { icon: '🧠', title: 'ADHD-Friendly', desc: 'Simple, clear, and free from distractions' },
  { icon: '💑', title: 'Built for Two',  desc: 'Share tasks and stay in sync as a couple' },
  { icon: '🎯', title: 'Focus Mode',     desc: 'Zero in on what matters most right now' },
]

function App() {
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
      {/* Hero */}
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

      {/* Feature cards */}
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={2.5}
        sx={{ maxWidth: 720, width: '100%' }}
      >
        {features.map(({ icon, title, desc }) => (
          <Card
            key={title}
            elevation={0}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              borderRadius: '1rem',
              flex: '1 1 180px',
              maxWidth: 220,
              textAlign: 'center',
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: 'rgba(167, 139, 250, 0.5)',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
              },
            }}
          >
            <CardContent sx={{ p: '1.75rem 1.5rem !important' }}>
              <Typography sx={{ fontSize: '2rem', mb: '0.875rem', lineHeight: 1 }}>
                {icon}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                {desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* CTA */}
      <Button
        variant="contained"
        size="large"
        sx={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
          borderRadius: '100px',
          px: 5,
          py: 1.5,
          fontSize: '1.125rem',
          fontWeight: 700,
          letterSpacing: '0.01em',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            opacity: 0.92,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 28px rgba(124, 58, 237, 0.5)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        Let's Get Started →
      </Button>
    </Box>
  )
}

export default App
