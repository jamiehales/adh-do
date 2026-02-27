import { Navigate, Route, Routes } from 'react-router-dom'
import UserPickerPage from './pages/UserPickerPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserPickerPage />} />
      <Route path="/home/:userId" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
