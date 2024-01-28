"use client";

import React, { useRef, useState } from "react";
import { BiChevronLeftCircle, BiChevronRightCircle } from "react-icons/bi";
import Container from "./Container";
import Card from "./card";

function Row({ movies, title, isMain }) {
    const rowRef = useRef(null);
    const [isMoved, setIsMoved] = useState(false);

    const handleClick = (direction) => {
        setIsMoved(true);

        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;

            const scrollTo =
                direction === "left"
                    ? scrollLeft - clientWidth
                    : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className={`${isMain && "pb-30"}`}>
            <div
                className={`${isMain ? "h-41" : "h-52"} space-y-0.5 md:space-y-2 px-4`}
            >
                <Container header={title} isTop={false}>
                    <div className="group relative md:-ml-2">
                        <BiChevronLeftCircle
                            className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && "hidden"
                                }`}
                            onClick={() => handleClick("left")}
                        />
                        <div
                            ref={rowRef}
                            className="flex items-center scrollbar-hide space-x-0.5 overflow-x-scroll md:space-x-3 md:p-2"
                        >
                            {isMain && (
                                <div className="flex items-center space-x-3 md:space-x-5">
                                    {movies?.map((movie) => (
                                        <Card
                                            className="w-40 md:w-48"
                                            key={movie.id}
                                            id={movie.id}
                                            image={movie.poster_url}
                                            title={movie.title || movie.name}
                                            type={"movie"}
                                            release_date={movie.release_date}
                                            rating={movie.rating}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <BiChevronRightCircle
                            className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
                            onClick={() => handleClick("right")}
                        />
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Row;
