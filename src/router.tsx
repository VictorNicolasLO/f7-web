
import { Navigate, Route, Routes, } from 'react-router-dom'
import Login from './routes/login'
import { memo } from 'react'
import Home from './routes/home'
import { useAuth } from './hooks/use-auth'


const RootRouter = () => {
  const auth = useAuth()
  const status = auth.state.status
  if (status === 'not-ready') return <></>
  if (status === 'unauthenticated' || status === 'authenticating')
    return <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  if (status === 'authenticated')
    return <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

}

export default memo(RootRouter)

