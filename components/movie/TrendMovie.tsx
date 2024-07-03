"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from 'react-icons/fa';

interface Movie {
  title: string;
  overview: string;
  releaseDate: string;
  posterSrc: string;
  adult: boolean;
  backdropPath: string;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  popularity: number;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

interface MovieResponse {
  movies: Movie[];
}

function truncateText(text: string, wordLimit: number): string {
  const words = text.split(" ");
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(" ") + "...";
}

export async function getTrendMovie(): Promise<MovieResponse> {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.THE_MOVIE_DB_BEARER_TOKEN!, 
    }
  };

  const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
  const imgUrl = `https://image.tmdb.org/t/p/w500`;

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    const movies: Movie[] = data.results.map((item: any) => ({
      title: item.title,
      overview: truncateText(item.overview, 20),
      releaseDate: new Date(item.release_date).toLocaleDateString(),
      posterSrc: `${imgUrl}${item.poster_path}`,
      adult: item.adult,
      backdropPath: `${imgUrl}${item.backdrop_path}`,
      genreIds: item.genre_ids,
      id: item.id,
      originalLanguage: item.original_language,
      originalTitle: item.original_title,
      popularity: item.popularity,
      video: item.video,
      voteAverage: item.vote_average,
      voteCount: item.vote_count,
    }));

    return { movies };
  } catch (err) {
    console.error("Error fetching trending movies: ", err);
    return { movies: [] };
  }
}

const TrendMovie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchMovies() {
      const { movies } = await getTrendMovie();
      setMovies(movies);
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 3000);

    return () => clearTimeout(interval);
  }, [activeIndex, movies.length]);

  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index);
  };

  if (movies.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {movies.map((item, index) => (
            <div
              className={`absolute inset-0 duration-700 ease-in-out transform ${
                index === activeIndex
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
              data-carousel-item
              key={item.id}
            >
              <img
                src={item.backdropPath}
                className="relative block w-full h-full"
                alt={item.title}
              />
              <div className="flex flex-row gap-2 p-1 absolute backdrop-brightness-50 text-white border-gray-500 rounded-lg top-5 left-5">
                <div>
                  <img
                    src={item.posterSrc}
                    width={215}
                    height={100}
                    className="rounded-md"
                    alt="movie poster"
                  />
                </div>
                <div className="flex flex-col gap-2 p-3 ">
                  <h1 className=" font-semibold text-xl text-center">{item.title}</h1>
                  <p className="w-[300px] text-justify text-sm">{item.overview}</p>
                  <p>{item.releaseDate}</p>
                  <p>{item.voteCount} vote</p>
                  <span className="flex gap-1">
                      {Math.round(item.voteAverage * 2) / 2}
                    <FaStar color="yellow" className="my-auto"/>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <!-- Slider indicators --> */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          {movies.map((_, index) => (
            <button
              type="button"
              className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-white" : "bg-gray-400"}`}
              aria-current={index === activeIndex ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              key={index}
              onClick={() => handleIndicatorClick(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendMovie;
