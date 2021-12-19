import { useEffect } from 'react';

import styled from 'styled-components';

import { useParams } from 'react-router-dom';

import SeriesDetail from 'components/SeriesDetail';
import { Loading, Issue } from 'components/Boxes';

import { RootState } from 'store';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { fetchDetailsAsync } from 'store/series';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
`;

const WrapStart = styled(Wrap)`
  align-self: start;
`;

const Details = () => {
  const { id } = useParams() as {
    id: string;
  };
  const dispatch = useAppDispatch();

  const { series, status, error } = useAppSelector((state: RootState) => ({
    series: state.series.details.items[id],
    status: state.series.details.status,
    error: state.series.details.error
  }));

  useEffect(() => {
    if (series === undefined) {
      dispatch(fetchDetailsAsync(id));
    }
  }, [id, series, dispatch]);

  return status === 'fulfilled' && series !== undefined ? (
    <WrapStart>
      <SeriesDetail item={series} />
    </WrapStart>
  ) : status === 'pending' ? (
    <Wrap>
      <Loading />
    </Wrap>
  ) : status === 'rejected' ? (
    <Wrap>
      <Issue text={error} />
    </Wrap>
  ) : null;
};

export default Details;
