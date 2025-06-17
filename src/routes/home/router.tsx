import { Navigate, Route, Routes } from "react-router-dom"

import PostView from "./routes/post-view"
import { memo } from "react"
import ProfileTimeline from "./routes/profile-timeline"
import News from "./routes/news"
import PersonalFeed from "./routes/personal-feed"



const HomeRouter = () => {
    return (
        <Routes>
            <Route path="feed/news" element={<News />} />
            <Route path="feed/personal-feed" element={<PersonalFeed />} />
            <Route path="profile-timeline/:id" element={<ProfileTimeline />} />
            <Route path="post-view/:id" element={<PostView />} />
            <Route path="*" element={<Navigate to="feed/news" replace />} />
        </Routes>
    )
}
export default memo(HomeRouter)