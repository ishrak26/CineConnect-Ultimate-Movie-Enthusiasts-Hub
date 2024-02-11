import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@components/Sidebar';
import BaseLayout from '@components/BaseLayout';
import Navbar from '@components/navbar';
import Container from "@components/Container";
import Row from '@components/Row';
import ReviewCard from '@components/ReviewCard';
import CinefellowsRow from '@components/CinefellowsRow'; // Adjust the import path as necessary
import EditButton from '@components/EditButton'; // Adjust the import path as needed
import SendCinefellowRequestButton from '@components/SendCinefellowRequestButton'; // Adjust the import path as needed
import RemoveCinefellowButton from '@components/RemoveCinefellowButton'; // Adjust the import path as needed
import WithdrawCinefellowRequestButton from '@components/WithdrawCinefellowRequestButton'; // Adjust the import path as needed
import AcceptCinefellowRequestButton from '@components/AcceptCinefellowRequestButton'; // Adjust the import path as needed
import DeclineCinefellowRequestButton from '@components/DeclineCinefellowRequestButton'; // Adjust the import path as needed
// import Profiles from '@components/profiles';
import Footer from '@components/footer';
import Recommendations from '@components/recommendations';
import { Box, Typography } from "@mui/material"; // Import from MUI
// import styles from '../styles/profile.module.css';
 // Adjust the path according to your file structure

 const router = useRouter();

 const handleUnfollow = (userId, fellowId) => {
  console.log(`UserId and FellowID: ${userId}`)
  // Handle the rating logic (e.g., send to API)

  try {
    const response = fetch(`http://localhost:4000/v1/movie/${data.id}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: data.id,
        userId: 1,
        rating: rate,
      }),
    }).then((res) => res.json())
  } catch (err) {
    console.log(err)
  }
}
 
// import Awards from '@components/Awards'; // Assuming you have this component
// import Activities from '@components/Activities'; // Assuming you have this component

export default function Profile({ watchedMovies, watchlist, reviews, forums, cineFellows, userType, profileInfo, cinefellowCount }) {
  userType = 3; // 1 for user, 2 for cinefellow, 3 for request sent, 4 for request received, 5 for non-cinefellow
  // Assuming we have the user data for now as static content
  const userData = {
    name: profileInfo.full_name,
    profilePic: 'https://via.placeholder.com/150', // Replace with actual image source
    cineFellowsCount: 124,
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


  // Function to create section headers with the same style as in Container component
  const SectionHeader = ({ title }) => (
    <Box sx={{
      position: "relative",
      paddingX: { xs: "20px", md: 0 },
      maxWidth: "1366px",
      width: "100%",
      color: "#fff",
      "&::before": {
        content: '""',
        position: "absolute",
        left: { xs: "20px", md: "0" },
        top: "100%",
        height: "5px",
        width: "100px",
        backgroundColor: "primary.main",
      },
      marginBottom: '2rem' // Adjust the margin as needed
    }}>
      <Typography variant="h5" fontWeight="700" textTransform="uppercase">
        {title}
      </Typography>
    </Box>
  );

  // Spacing classes for margin
  const sectionMargin = "mb-20 mt-16"; // Margin at the bottom of each section


  return (
    <div>
      <Navbar />
      <BaseLayout>
        <div className="container">
          <main className="flex-grow p-4">
            <div className={`user-profile-details flex items-end ${sectionMargin}`}>
              <img
                src={profileInfo.image_url}
                alt={`${profileInfo.username}'s profile`}
                className="rounded-full h-64 w-64 mr-8 object-cover" // Adjust h-32 and w-32 to the size you desire
              /> 
              <div className="flex-grow">
                <h1 className="text-4xl font-bold mb-1">{profileInfo.full_name}</h1>
                {cinefellowCount < 2 && <p>{cinefellowCount} Cinefellow</p>}
                {cinefellowCount >= 2 && <p>{cinefellowCount} Cinefellows</p>}
                <p className="text-gray-400 italic mt-4">{userData.bio}</p>
              </div>
              {userType === 1 ? ( // If the user is the owner of the profile
                <EditButton />
              ) : userType === 2 ? (  // If the user is a cinefellow of the profile owner
                // write the handler function for the remove cinefellow button
                <RemoveCinefellowButton onClick={async () => {
                  // Handler logic for removing a cinefellow
                  try {
                    // Assuming removeCinefellow is an API call function
                    const response = fetch unfollowCinefellow(cinefellowId);
                    if (response.success) {
                      // Refresh the profile page to show the updated cinefellow list
                      router.reload();
                    }
                  } catch (error) {
                    console.error('Failed to remove cinefellow:', error);
                  }
                }} />
              ) : userType === 3 ? (  // If the user has been sent a request by the profile owner
                // Wrap the buttons in a div with a flex container
                <div style={{ display: 'flex', gap: '10px' }}> 
                  <AcceptCinefellowRequestButton />
                  <DeclineCinefellowRequestButton />
                </div>
              ) : userType === 4 ? (  // If the user has sent a request to the profile owner
                <WithdrawCinefellowRequestButton />
              ) : userType === 5 ? (  // If profile owner is someone else
                <SendCinefellowRequestButton />
              ) : (
                <></>
              )}
            </div>

            {/* Watched Section */}
            <SectionHeader title="Watched" />
            <div className={`${sectionMargin}`}>
              <Row movies={watchedMovies} isMain={true} />
            </div>
            

            {/* Watchlist Section */}
            <SectionHeader title="Watchlist" />
            <div className={`${sectionMargin}`}>
              <Row movies={watchlist} isMain={true} />
            </div>

            {/* Reviews Section */}
            <SectionHeader title="Recent Reviews" />
            <div className={`space-y-4 ${sectionMargin}`}>
              {userReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>

            {/* Discussion Forums Section */}
            <SectionHeader title="Discussion Forums"/>
            <Row movies={forums} isMain={true} />

            {/* cineFellows Section */}
            <SectionHeader title="Cinefellows"/>
            <div className={`rounded-full h-64 w-64 mr-8 object-cover ${sectionMargin}`}>
              <CinefellowsRow cinefellows={cineFellows} />
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

  const query = context.query;  // Get the query parameters
  const cookie = context.req.headers.cookie;
  const username = context.req.params.username;

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
    const [watchedMovies, cineFellows, watchlist, reviews, forums, userType, profileInfo, cinefellowCount ] = await Promise.all([
      fetchData(`http://localhost:4000/v1/profile/${username}/watched/`), 
      fetchData(`http://localhost:4000/v1/profile/${username}/cinefellows/`),
      fetchData(`http://localhost:4000/v1/profile/${username}/watchlist/`),
      fetchData(`http://localhost:4000/v1/movies/`),  // dummy, will need to change to fetch top few reviews
      fetchData(`http://localhost:4000/v1/movies/`),  // dummy, will need to change to fetch top forums
      fetchData(`http://localhost:4000/v1/profile/${username}/identify-profile`),
      fetchData(`http://localhost:4000/v1/profile/${username}/`),
      fetchData(`http://localhost:4000/v1/profile/${username}/cinefellows/count/`), 

    ]);
    console.log('cinefellow count:', cinefellowCount);

    // Check if any of the responses indicate 'not found'
    if (watchedMovies.notFound || watchlist.notFound || reviews.notFound || forums.notFound || cineFellows.notFound || userType.notFound || profileInfo.notFound) {
      return { notFound: true };
    }

    return {
      props: {
        ...watchedMovies,
        ...watchlist,
        reviews,
        forums,
        ...cineFellows,
        ...userType,
        ...profileInfo,
        ...cinefellowCount,
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
