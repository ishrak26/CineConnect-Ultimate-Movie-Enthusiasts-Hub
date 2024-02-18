// requests.js
import React, { useState, useEffect } from 'react';
import Navbar from '@components/navbar';
import Footer from '@components/footer';
import BaseLayout from '@components/BaseLayout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CinefellowRequestCard from '@components/CinefellowRequestCard';
import Pagination from '@components/pagination';

const Requests = ({ initialRequests, initialPage }) => {
  const totalPages = 10;
  const [requests, setRequests] = useState(initialRequests);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async (page) => {
      try {
        const res = await fetch(`http://localhost:4000/v1/profile/username/cinefellows/requests?page=${page}`);
        const data = await res.json();
        setRequests(data.pendingRequests);
        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to fetch pending requests:', error);
      }
    };

    if (currentPage !== initialPage) {
      fetchRequests(currentPage);
    }
  }, [currentPage, initialPage]);

  const handlePageChange = (page) => {
    router.push(`/requests?page=${page}`);
    setCurrentPage(page);
  };

  return (
    <div>
      <Head>
        <title>Pending Cinefellow Requests</title>
      </Head>
      <Navbar />
      <BaseLayout>
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold mb-6">Pending Cinefellow Requests</h1>
          {requests.map((request) => (
            <CinefellowRequestCard
              key={request.id}
              requestorPhoto={request.requestorPhoto}
              requestorUsername={request.requestorUsername}
              commonForumsCount={request.commonForumsCount}
              onAccept={() => console.log('Accept', request.id)}
              onReject={() => console.log('Reject', request.id)}
            />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </BaseLayout>
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context) {
  const page = context.query.page || 1;
  const limit = 10; // Adjust based on your pagination preference
  const cookie = context.req.headers.cookie;
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
  try{
    const User = await fetchData(`http://localhost:4000/v1/auth/isLoggedIn`);
    // console.log("User: ", User.user.username);
    // Fetch initial pending requests
    const res = await fetchData(`http://localhost:4000/v1/profile/${User.user.username}/cinefellows/requests?page=${page}&limit=${limit}`);
    const { pendingRequests } = res;

    if (pendingRequests.notFound) {
      return { notFound: true };
    }

    const initialRequests = pendingRequests.incomingRequests || [];
    console.log('InitialRequests: ', initialRequests);

    return {
      props: {
        initialRequests,
        initialPage: parseInt(page, 10),
        // totalPages,
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
};

export default Requests;
