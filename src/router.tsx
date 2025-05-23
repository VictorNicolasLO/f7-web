
import { Navigate, Route, Routes,  } from 'react-router-dom'
import Login from './routes/login'

const RootRouter = () => {
  return (
      <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />}  />
          <Route path="/" element={<Navigate to="/login" replace />}  />
          {/* <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard loggedIn={loggedIn} />} /> */}
      </Routes>
  )
}

export default RootRouter

