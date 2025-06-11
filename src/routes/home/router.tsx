import { Navigate, Route, Routes } from "react-router-dom"
import Feed from "./routes/feed"
import PostView from "./routes/post-view"
import { memo } from "react"
import ProfileTimeline from "./routes/profile-timeline"

 

const HomeRouter = () => {
    return (
        <Routes>
            <Route path="feed/*" element={<Feed />} />
            <Route path="profile-timeline/:id" element={<ProfileTimeline />} />
            <Route path="post-view/:id" element={<PostView />} />
            <Route path="*" element={<Navigate to="feed" replace />} />
        </Routes>
    )
}
export default memo(HomeRouter)