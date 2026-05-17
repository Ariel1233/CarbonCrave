import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import HomeFeed from './pages/HomeFeed'
import NeighborhoodExplorer from './pages/NeighborhoodExplorer'
import NeighborhoodDetail from './pages/NeighborhoodDetail'
import RestaurantProfile from './pages/RestaurantProfile'
import Leaderboard from './pages/Leaderboard'
import RestaurantDashboard from './pages/RestaurantDashboard'
import CommunityChallenges from './pages/CommunityChallenges'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/explore" element={<NeighborhoodExplorer />} />
          <Route path="/explore/:name" element={<NeighborhoodDetail />} />
          <Route path="/restaurant/:id" element={<RestaurantProfile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<RestaurantDashboard />} />
          <Route path="/challenges" element={<CommunityChallenges />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  )
}
