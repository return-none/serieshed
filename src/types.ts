export type Series = {
  id: number;
  name: string;
  summary: string;
  image: string;
};

// Simplified API response Series type
export type SeriesAPI = {
  id: number;
  name: string;
  summary: null | string;
  image: null | {
    medium: string;
    original: string;
  };
};

export type Episode = {
  id: number;
  name: string;
  summary: string;
  season: number;
  episode: number;
  image: string;
};

// Simplified API response Episodes type
export type EpisodesAPI = SeriesAPI & {
  season: number;
  number: number;
};
