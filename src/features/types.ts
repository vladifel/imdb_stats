export interface IPersonData {
  ImdbId: string;
  Name: any;
}

export interface IFilmData {
  title: string;
  year: number;
  image: any;
  id: string;
  rating: number | null;
  imdbVotes: number | null;
}

export interface IFilmImage {
  height: number;
  id: string;
  url: string;
  width: number;
}

export interface IFilmInfo {
  category: string;
  id: string;
  image: IFilmImage;
  status: string;
  title: string;
  titleType: string;
  year: number;
}

export interface IChartData {
  id: string;
  name: string;
  akas: string[];
  image: IFilmImage;
  profession: string;
  averageScore: number;
  films: IFilmData[];
  filmsData: IFilmInfo[];
}
