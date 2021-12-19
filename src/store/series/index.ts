import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

import { Series, SeriesAPI, Episode, EpisodesAPI } from 'types';

const BASE_API_URL = 'https://api.tvmaze.com';
const SERIES_LIST_URL = '/search/shows';
const SERIES_DETAILS_URL = '/shows/{id}';
const SERIES_EPISODES_URL = '/shows/{id}/episodes';

const REMOVE_HTML_REGEX = /(<([^>]+)>)/gi;

const SERIES_PLACEHOLDER =
  'https://images.placeholders.dev/?width=249&height=373&text={name}&bgColor=%23E9E9E9&textColor=%23212529';

const EPISODE_PLACEHOLDER =
  'https://images.placeholders.dev/?width=427&height=240&text={name}&bgColor=%23E9E9E9&textColor=%23212529';

const callAPI = (url: string) => {
  return fetch(url).then((resp) => {
    if (resp.ok) {
      return resp.json();
    }

    throw new Error(resp.statusText);
  });
};

export type seriesState = {
  search: string;
  list: {
    items: Series[];
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: null | string;
    currentRequestId: string;
  };
  details: {
    items: {
      [key: string]: {
        series: Series;
        episodes: Episode[];
      };
    };
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: null | string;
    currentRequestId: string;
  };
};

const initialState: seriesState = {
  search: '',
  list: {
    items: [],
    status: 'idle',
    error: null,
    currentRequestId: ''
  },
  details: {
    items: {},
    status: 'idle',
    error: null,
    currentRequestId: ''
  }
};

export const fetchSeriesAsync = createAsyncThunk(
  'series/fetchSeries',
  async (_, { getState, requestId }) => {
    // stop double requests
    const state = getState() as RootState;
    const loading = state.series.list.status;
    const currentRequestId = state.series.list.currentRequestId;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const url =
      BASE_API_URL +
      SERIES_LIST_URL +
      `?q=${encodeURIComponent(state.series.search)}`;
    const data: {
      show: SeriesAPI;
    }[] = await callAPI(url);

    const series: Series[] = data.map((item) => ({
      id: item.show.id,
      name: item.show.name,
      summary:
        item.show.summary === null
          ? ''
          : item.show.summary.replace(REMOVE_HTML_REGEX, ''),
      image: !!item.show.image
        ? item.show.image.original
        : SERIES_PLACEHOLDER.replace(
            '{name}',
            encodeURIComponent(item.show.name)
          )
    }));

    return series;
  }
);

export const fetchDetailsAsync = createAsyncThunk(
  'series/fetchDetails',
  async (seriesId: string, { getState, requestId }) => {
    // stop double requests
    const state = getState() as RootState;
    const loading = state.series.details.status;
    const currentRequestId = state.series.details.currentRequestId;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    // Full Caching
    const seriesCachedWithEpisodes = state.series.details.items[seriesId];
    if (seriesCachedWithEpisodes !== undefined) {
      return seriesCachedWithEpisodes;
    }

    let series: Series;

    // Series Caching
    const seriesCached = state.series.list.items.find(
      (series: Series) => String(series.id) === seriesId
    );
    if (seriesCached !== undefined) {
      series = seriesCached;
    } else {
      const url = BASE_API_URL + SERIES_DETAILS_URL.replace('{id}', seriesId);
      const data: SeriesAPI = await callAPI(url);
      series = {
        id: data.id,
        name: data.name,
        summary:
          data.summary === null
            ? ''
            : data.summary.replace(REMOVE_HTML_REGEX, ''),
        image:
          data.image !== null
            ? data.image.original
            : SERIES_PLACEHOLDER.replace(
                '{name}',
                encodeURIComponent(data.name)
              )
      };
    }

    const url = BASE_API_URL + SERIES_EPISODES_URL.replace('{id}', seriesId);
    const data: EpisodesAPI[] = await callAPI(url);

    const episodes = data.map((item: EpisodesAPI) => ({
      id: item.id,
      name: item.name,
      summary:
        item.summary === null
          ? ''
          : item.summary.replace(REMOVE_HTML_REGEX, ''),
      season: item.season,
      episode: item.number,
      image:
        item.image !== null
          ? item.image.original
          : EPISODE_PLACEHOLDER.replace('{name}', encodeURIComponent(item.name))
    }));

    return {
      series,
      episodes
    };
  }
);

export const seriesSlice = createSlice({
  name: 'series',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    flushSeries: (state) => {
      state.list.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeriesAsync.pending, (state, action) => {
        if (state.list.status === 'idle' || state.list.status === 'fulfilled') {
          state.list.items = [];
          state.list.error = null;
          state.list.status = 'pending';
          state.list.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchSeriesAsync.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.list.status === 'pending' &&
          state.list.currentRequestId === requestId
        ) {
          const series = action.payload as Series[];
          state.list.status = 'fulfilled';
          state.list.items = series;
          state.list.currentRequestId = '';
        }
      })
      .addCase(fetchSeriesAsync.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.list.status === 'pending' &&
          state.list.currentRequestId === requestId
        ) {
          state.list.items = [];
          state.list.status = 'rejected';
          state.list.error = action.error.message as string;
          state.list.currentRequestId = '';
        }
      });

    builder
      .addCase(fetchDetailsAsync.pending, (state, action) => {
        if (state.list.status === 'idle' || state.list.status === 'fulfilled') {
          state.details.error = null;
          state.details.status = 'pending';
          state.details.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchDetailsAsync.fulfilled, (state, action) => {
        const { requestId, arg } = action.meta;
        if (
          state.details.status === 'pending' &&
          state.details.currentRequestId === requestId
        ) {
          state.details.status = 'fulfilled';
          state.details.items[arg] = action.payload as {
            series: Series;
            episodes: Episode[];
          };
          state.details.currentRequestId = '';
        }
      })
      .addCase(fetchDetailsAsync.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.details.status === 'pending' &&
          state.details.currentRequestId === requestId
        ) {
          state.details.status = 'rejected';
          state.details.error = action.error.message as string;
          state.details.currentRequestId = '';
        }
      });
  }
});

export const { flushSeries, setSearch } = seriesSlice.actions;

export default seriesSlice.reducer;
