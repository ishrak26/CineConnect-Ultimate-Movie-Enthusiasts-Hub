import MessageContainer from '@components/chat/MessageContainer'
import Sidebar from '@components/chat/SideBar'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import Head from 'next/head'

const Home = ({ user }) => {
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
          <Sidebar user={user} />
          <MessageContainer />
        </div>
      </BaseLayout>
    </>
  )
}
export default Home

export async function getServerSideProps(context) {
  const userId = context.params.userId
  const cookie = context.req.headers.cookie

  async function fetchData(url, params) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        credentials: 'include',
        ...params,
      })

      // console.log("response ", response);

      if (response.ok) {
        return await response.json()
      }
      return { error: response.statusText }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { notFound: true }
      }
      return { error: error.message }
    }
  }

  const userInfo = await fetchData(
    `http://localhost:4000/v1/profile/${userId}/profile`
  )

  const user = await userInfo.profileInfo
  console.log('user', user)

  return {
    props: {
      user,
    },
  }
}
