"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZjljMTdhNGZiYTQwZDBmZDc4ODkwNTdjMzc2MDg5OSIsIm5iZiI6MTcxOTc1Nzc2OS4xODI1NjksInN1YiI6IjY1ZTViZDNiYjdhMTU0MDE2MzdhMzQ1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GlQTe5vDRYgpCVdz8b0b3OmHm5QIjpCVrJ46p381QWE",
    },
  };

  const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
  const imgUrl = `https://image.tmdb.org/t/p/w500`;

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    const movies: Movie[] = data.results.map((item: any) => ({
      title: item.title,
      overview: truncateText(item.overview, 10),
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
                className=" relative block w-full h-full  "
                alt={item.title}
              />
              <div className="flex flex-row gap-2 p-1 absolute  backdrop-blur-sm text-black border-gray-500 rounded-lg top-5 left-5">
                <div>
                  <img
                    src={item.posterSrc}
                    width={215}
                    height={100}
                    className="rounded-md"
                    alt="movie poster"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-wrap font-semibold text-xl">"{item.title}"</h1>
                  <p className="text-xs">{item.overview}</p>
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
              className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-white" : "bg-gray-400"}`}
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
