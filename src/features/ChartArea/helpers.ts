import axios from "axios";

import { IChartDataItem } from "../../store/actions/chartDataItems";
import { getRandomRgbaColor } from "../../helpers/ColorGenerator";
import { IChartData, IFilmData, IPersonData } from "../types";

export const buildData = async (
  resultArray: any,
  selectedName: IPersonData | undefined
): Promise<IChartData | undefined> => {
  if (!selectedName) {
    return;
  }

  const { ImdbId, Name } = selectedName;

  const chartData: IChartData = {
    id: ImdbId,
    name: Name,
    akas: resultArray.base.akas,
    image: resultArray.base.image,
    profession: "Director",
    averageScore: 0,
    films: [],
    filmsData: [],
  };

  resultArray.filmography.forEach((film: any) => {
    if (
      film.category !== "self" &&
      film.status === "released" &&
      film.titleType !== "video" &&
      film.category === "director"
    ) {
      chartData.filmsData.push(film);
    }
  });

  return chartData;
};

export const buildRatings = async (film: any) => {
  const rawId = film.id.split("/");
  const id = rawId[2];
  const ratingData = await getRatingsData(id);

  if (!ratingData.rating) {
    return;
  }
  const filmData: IFilmData = {
    title: film.title,
    year: film.year,
    image: film.poster,
    id: id,
    rating: Number(ratingData.rating) || null,
    imdbVotes: Number(ratingData.rating_votes) || null,
  };
  return filmData;
};
export const fetchData = async (selectedName: IPersonData | undefined) => {
  const options: any = {
    method: "GET",
    url: "https://imdb8.p.rapidapi.com/actors/get-all-filmography",
    params: { nconst: selectedName!.ImdbId },
    headers: {
      "x-rapidapi-key": "b93408b0b0msh15310ee4e250e2bp15df7cjsnd43da7ee2788",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
    },
  };
  return await axios
    .request(options)
    .then(async response => {
      return await buildData(response.data, selectedName);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const fetchRatings = async (movieId: string) => {
  const options: any = {
    method: "GET",
    url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${movieId}`,
    headers: {
      "x-rapidapi-key": "b93408b0b0msh15310ee4e250e2bp15df7cjsnd43da7ee2788",
      "x-rapidapi-host": "imdb-internet-movie-database-unofficial.p.rapidapi.com",
    },
  };
  // const options: any = {
  //     method: 'GET',
  //     url: `http://www.omdbapi.com/?i=${movieId}&apikey=262c131`,
  // };
  return await axios
    .request(options)
    .then(response => response.data)
    .catch(error => console.error(error));
};

const getRatingsData = async (movieId: string) => await fetchRatings(movieId).then(res => res);

export const buildDefaultData = (dataToFetch: IChartData): IChartDataItem => ({
  id: dataToFetch.id,
  color: getRandomRgbaColor(0.5),
  isLoading: true,
  isShown: true,
  isInfoOpen: false,
  data: dataToFetch,
});
