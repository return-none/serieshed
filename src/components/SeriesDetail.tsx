import styled from 'styled-components';

import map from 'ramda/src/map';
import sort from 'ramda/src/sort';
import pipe from 'ramda/src/pipe';
import toPairs from 'ramda/src/toPairs';
import groupBy from 'ramda/src/groupBy';

import { Series, Episode } from 'types';

const Details = styled.div`
  position: sticky;
  top: calc(var(--main-logo-height) + var(--navbar-padding) * 2 + 1rem);

  background-color: rgb(var(--white-rgb));

  border: 1px solid rgba(var(--white-rgb), 0.1);
  border-radius: var(--border-radius);

  & .poster {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  & .details {
    padding: 0.5rem;

    .header {
      margin: 0.25rem 0 0.25rem;
    }

    .summary {
      margin: 0;
      text-align: justify;
    }
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: 22.5% 75%;
  gap: 2.5%;

  @media only screen and (min-device-width: 320px) and (max-device-width: 667px) {
    grid-template-columns: 100%;
  }

  width: 100%;

  user-select: none;
`;

const Season = styled.div`
  margin-bottom: 1rem;

  background-color: rgb(var(--white-rgb));

  padding: 0.5rem;

  border: 1px solid rgba(var(--white-rgb), 0.1);
  border-radius: var(--border-radius);

  & .header {
    margin: 0;
    margin-left: 1rem;
  }

  &:last-child {
    margin: 0;
  }
`;

const EpisodesList = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;

  padding: 1rem;

  // NO scrollbar
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const EpisodeDetails = styled.div`
  flex: 0 0 auto;
  margin-right: 1.5rem;

  transition: 300ms;

  border-radius: var(--border-radius);

  position: relative;

  padding: 0;

  &:hover {
    transform: scale(1.05);

    .title {
      display: block;
    }
  }

  &:last-child {
    margin: 0;
  }

  img.poster {
    width: 20rem;
    vertical-align: middle;
    border-radius: var(--border-radius);
    padding: 0;
  }

  .title {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    border-radius: 0 0 var(--border-radius) var(--border-radius);

    margin: 0;
    padding: 0.5rem;
    background-color: rgba(var(--black-rgb), 0.25);
    color: rgb(var(--white-rgb));

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    display: none;
  }
`;

const SeriesDetails = (props: {
  item: {
    series: Series;
    episodes: Episode[];
  };
}) => {
  // Map list of episodes to seasons list
  const episodesMapped: { season: string; episodes: Episode[] }[] = pipe(
    groupBy((episode: Episode) => `${episode.season}`),
    toPairs,
    sort(
      (a: [string, Episode[]], b: [string, Episode[]]) =>
        Number(a[0]) - Number(b[0])
    ),
    map(([season, episodes]: [string, Episode[]]) => ({
      season,
      episodes: sort(
        (a: Episode, b: Episode) => Number(a.episode) - Number(b.episode),
        episodes
      )
    }))
  )(props.item.episodes);

  return (
    <Section>
      <aside>
        <Details>
          <img
            className="poster"
            src={props.item.series.image}
            alt={props.item.series.name}
            draggable={false}
          />
          <div className="details">
            <h2 className="header">{props.item.series.name}</h2>
            <p className="summary">{props.item.series.summary}</p>
          </div>
        </Details>
      </aside>

      <div>
        {episodesMapped.length ? (
          episodesMapped.map((season) => (
            <Season key={season.season}>
              <h2 className="header">Season {season.season}</h2>
              <EpisodesList>
                {season.episodes.map((episode) => (
                  <EpisodeDetails key={season.season + '_' + episode.episode}>
                    <img
                      className="poster"
                      src={episode.image}
                      alt={episode.name}
                      draggable={false}
                    />
                    <p className="title">{episode.name}</p>
                  </EpisodeDetails>
                ))}
              </EpisodesList>
            </Season>
          ))
        ) : (
          <p>No episodes info available</p>
        )}
      </div>
    </Section>
  );
};

export default SeriesDetails;
