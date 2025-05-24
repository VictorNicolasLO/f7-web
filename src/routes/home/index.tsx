import { For } from "@chakra-ui/react"
import Post from "../../components/post"
import PostBox from "../../components/post-box"
import TopBar from "../../components/topbar"

const Home = () => {
  return (<>
      <TopBar />
       <PostBox />
        <For each={new Array(10).fill(0).map((_, i) => i)}>
            {(item, index) => (<Post key={index}/>)}
            
        </For> 
  </>

  )
}
export default Home