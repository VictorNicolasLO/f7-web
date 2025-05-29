import { Navigate, Route, Routes } from "react-router-dom"
import News from "./routes/news"
import PersonalFeed from "./routes/personal-feed"
import { memo } from "react"

const FeedRouter = () => {
    return (
        <Routes>
            <Route path="/news" element={<News />} />
            <Route path="/personal-feed" element={<PersonalFeed />} />
            <Route path="*" element={<Navigate to="news" replace />} />
        </Routes>
    )
}
export default memo(FeedRouter)
