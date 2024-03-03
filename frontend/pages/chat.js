import MessageContainer from '../components/chat/MessageContainer'
import Sidebar from '@components/chat/SideBar'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import Head from 'next/head'

const Home = () => {
  return (
    <>
      <Head>
        <title>Chats &mdash; CineConnect</title>
        <meta
          name="description"
          content="Millions of movies, TV shows and people to discover. Explore now."
        />
        <meta
          name="keywords"
          content="where can i watch, movie, movies, tv, tv shows, cinema, movielister, movie list, list"
        />

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <Navbar />
      <BaseLayout>
        <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <Sidebar />
          <MessageContainer />
        </div>
      </BaseLayout>
    </>
  )
}
export default Home
