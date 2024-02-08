import React from 'react';
import Sidebar from '@components/Sidebar';
import BaseLayout from '@components/BaseLayout';
import Navbar from '@components/navbar';
import Row from '@components/Row';
import ReviewCard from '@components/ReviewCard';
// import Profiles from '@components/profiles';
import Footer from '@components/footer';
import Recommendations from '@components/recommendations';
// import styles from '../styles/profile.module.css';
 // Adjust the path according to your file structure
 
// import Awards from '@components/Awards'; // Assuming you have this component
// import Activities from '@components/Activities'; // Assuming you have this component

export default function Profile({ watched, watchlist, reviews, forums, cinefellows }) {
  // Assuming we have the user data for now as static content
  const userData = {
    name: 'Farhan Tahmid',
    profilePic: 'https://via.placeholder.com/150', // Replace with actual image source
    cinefellowsCount: 124,
    bio: 'Anime and movie enthusiast. Love to watch and discuss movies!',
    // Other user data can be included here
  };
  const userReviews = [
    {
      movieImage: 'https://via.placeholder.com/150', // Replace with actual image source
      movieName: 'Inception',
      rating: 5,
      timestamp: '2 days ago',
      content: 'Inception is a great movie. I loved the plot and the acting. The visuals were stunning. Would recommend to anyone who loves a good thriller.'
    },
    {
      movieImage: 'https://via.placeholder.com/150', // Replace with actual image source
      movieName: 'The Dark Knight',
      rating: 5,
      timestamp: '5 days ago',
      content: 'The Dark Knight is a masterpiece. Heath Ledger\'s performance as the Joker is iconic. The movie is a must-watch for any movie lover.Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
    },
  ]; // Assuming we have the user's reviews as static content




  return (
    <div>
      <Navbar />
      <BaseLayout>
        <div className="container">
          <main className="flex-grow p-4">
            <div className="user-profile-details flex items-end mb-16 mt-8"> {/* mb-8 adds margin-bottom */}
              <img src={userData.profilePic} alt={`${userData.name}'s profile`} className="rounded-full h-40 w-40 mr-8" /> 
              <div className="flex-grow">
                <h1 className="text-4xl font-bold mb-1">{userData.name}</h1>
                <p>{userData.cinefellowsCount} CineFellows</p>
                <p className="text-gray-400 italic mt-4">{userData.bio}</p>
              </div>
              <button className="text-sm text-blue-500 hover:text-blue-700 self-start">Edit profile</button> {/* self-start aligns to the top */}
            </div>
            <div className="profile-content">
              <Row movies={watched} title="Watched" isMain={true} />
              <Row movies={watchlist} title="Watchlist" isMain={true} />
              {/* <Row movies={reviews} title="Reviews" isMain={true} /> */}
              <div className="reviews-section my-5">
              <h2 className="text-xl font-bold mb-3">Recent Reviews</h2>
              {userReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>
              <Row movies={forums} title="Discussion Forums" isMain={true} />
              <Row movies={cinefellows} title="Cinefellows" isMain={true} />
            </div>
          </main>
          <aside className="w-1/4">
            {/* Place for Recommendations, Awards, Activities */}
          </aside>
        </div>
        <Footer />
      </BaseLayout>
    </div>
  );
};


// You will need to fetch the userData and other props for the component, potentially using getServerSideProps or getStaticProps


export async function getServerSideProps(context) {

  const query = context.query;
  const cookie = context.req.headers.cookie;

  // Helper function to fetch data
  async function fetchData(url, params) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        credentials: 'include',
        ...params
      });
      return await response.json();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { notFound: true };
      }
      return { error: error.message };
    }
  }

  // Use Promise.all to fetch data for different categories concurrently
  try {
    const [watched, watchlist, reviews, forums, cinefellows] = await Promise.all([
      fetchData(`http://localhost:4000/v1/movies/`),  // dummy movie cards, will need to fetch actual watched movies by the user
      fetchData(`http://localhost:4000/v1/movies/`),  // dummy movie cards, will need to fetch actual watchlist movies by the user
      fetchData(`http://localhost:4000/v1/movies/`),  // dummy, will need to change to fetch top few reviews
      fetchData(`http://localhost:4000/v1/movies/`),  // dummy, will need to change to fetch top forums
      fetchData(`http://localhost:4000/v1/movies/`)   // dummy, will need to change to fetch cinefellows
    ]);

    // Check if any of the responses indicate 'not found'
    if (watched.notFound || watchlist.notFound || reviews.notFound || forums.notFound || cinefellows.notFound) {
      return { notFound: true };
    }

    return {
      props: {
        watched,
        watchlist,
        reviews,
        forums,
        cinefellows,
        // Add other props as needed
      },
    };
  } catch (error) {
    console.error("Error during data fetching:", error);
    return {
      props: {
        error: error.message
      }
    };
  }
}
