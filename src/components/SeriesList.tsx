import styled from 'styled-components';

import { Link } from 'react-router-dom';

import { Series } from 'types';

const SeriesCardHolder = styled.div`
  user-select: none;

  background-color: rgb(var(--white-rgb));
  border: 1px solid rgba(var(--white-rgb), 0.1);
  border-radius: var(--border-radius);

  transition: 300ms;

  &:hover {
    transform: scale(1.05);
  }

  & a {
    text-decoration: none;
    color: rgb(var(--main-color-rgb));
  }

  & .poster {
    width: 100%;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  & .details {
    padding: 0.5rem;

    .header {
      margin: 0;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }

    .summary {
      margin: 0;

      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
`;

const SeriesCard = (props: { item: Series }) => (
  <SeriesCardHolder>
    <Link draggable={false} to={`/details/${props.item.id}`}>
      <img
        className="poster"
        src={props.item.image}
        alt={props.item.name}
        draggable={false}
      />
      <div className="details">
        <h5 className="header">{props.item.name}</h5>
        <p className="summary">{props.item.summary}</p>
      </div>
    </Link>
  </SeriesCardHolder>
);

// [TODO] make this responsive
const SeriesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);

  @media only screen and (min-device-width: 320px) and (max-device-width: 667px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SeriesList = (props: { list: Series[] }) => (
  <SeriesGrid>
    {props.list.map((item) => (
      <SeriesCard key={item.id} item={item} />
    ))}
  </SeriesGrid>
);

export default SeriesList;
