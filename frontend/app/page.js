"use client";

import DividerMovieLine from "@/components/DividerMovieLine";
import Footer from "@/components/Footer";
import GlobalLoading from "@/components/GlobalLoading";
import HomeBanner from "@/components/HomeBanner";
import Navbar from "@/components/Navbar";
import Row from "@/components/Row";
import ToastContainerBar from "@/components/ToastContainer";
import requests from "@/utils/requests";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [movie, setMovie] = useState({
    netflixOriginals: [],
    trendingNow: [],
    topRated: [],
    actionMovies: [],
    comedyMovies: [],
    horrorMovies: [],
    romanceMovies: [],
    documentaries: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [
        netflixOriginals,
        trendingNow,
        topRated,
        actionMovies,
        comedyMovies,
        horrorMovies,
        romanceMovies,
        documentaries,
      ] = await Promise.all([
        fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
        // ... other fetch requests
      ]);

      setMovie((prev) => ({
        ...prev,
        netflixOriginals: netflixOriginals.results,
        // ... other movie categories
      }));

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <ToastContainerBar />
      <Navbar />
      <GlobalLoading isLoading={isLoading} />
      {movie && (
        <main className="relative pl-4 pb-24 lg:space-y-24">
          <HomeBanner netflixOriginals={movie.netflixOriginals} />
          {/* Rows for different movie categories */}
          <Footer />
        </main>
      )}
    </motion.div>
  );
}
