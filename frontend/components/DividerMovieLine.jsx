"use client";

import SwiperSlidePage from "./SwiperSlidePage";
import { baseURL } from "@/utils/baseUrl";

function DividerMovieLine({ netflixOriginals, horrorMovies }) {
  return (
    <div className="h-[60vh] space-y-0.5 md:space-y-2 px-4">
      {/* Uncomment and use the following line if you need a title */}
      {/* <h2 className="w-80 cursor-pointer text-xl font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl uppercase">
        Recommended
      </h2> */}
      <div className="group relative md:-ml-2">
        <div className="inline-block md:flex space-x-10">
          <SwiperSlidePage movies={netflixOriginals} baseUrl={baseURL} />
          <SwiperSlidePage movies={horrorMovies} baseUrl={baseURL} />
        </div>
      </div>
    </div>
  );
}

export default DividerMovieLine;
