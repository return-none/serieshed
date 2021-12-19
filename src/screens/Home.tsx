import { useMemo, useCallback, useState } from 'react';

import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from 'store/hooks';
import { setSearch, flushSeries, fetchSeriesAsync } from 'store/series';

import { debounce } from 'utils';

import { RootState } from 'store';

import Input from 'components/Input';
import { Loading, Issue, Info } from 'components/Boxes';
import SeriesList from 'components/SeriesList';

const DEBOUNCE_TIMEOUT = 1 * 1000;

const InputSection = styled.section`
  width: 100%;
  margin-bottom: 1.25rem;
  padding: 0 1.25rem;

  position: sticky;
  top: calc(var(--main-logo-height) + var(--navbar-padding) * 2 + 1.25rem);
  z-index: 10;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
  width: 100%;
`;

const Home = () => {
  const [pending, setPending] = useState<boolean>(false);

  const { status, list, search, error } = useAppSelector(
    (state: RootState) => ({
      status: state.series.list.status,
      list: state.series.list.items,
      search: state.series.search,
      error: state.series.list.error
    })
  );
  const dispatch = useAppDispatch();

  const requestSeries = useMemo(() => {
    return debounce(() => {
      setPending(false);
      dispatch(fetchSeriesAsync());
    }, DEBOUNCE_TIMEOUT);
  }, [dispatch]);

  const onChange = useCallback(
    (newSearch: string) => {
      dispatch(setSearch(newSearch));
      if (newSearch.length > 0) {
        setPending(true);
        requestSeries();
      } else {
        dispatch(flushSeries());
      }
    },
    [dispatch, requestSeries]
  );

  return (
    <Wrap>
      <InputSection>
        <Input
          type="text"
          name="search"
          placeholder="Search"
          value={search}
          onChange={onChange}
        />
      </InputSection>
      <section>
        {status === 'fulfilled' && search.length > 0 && list.length > 0 && (
          <SeriesList list={list} />
        )}

        {status === 'pending' && search.length > 0 && <Loading />}

        {status === 'rejected' && <Issue text={error} />}

        {status === 'fulfilled' &&
          search.length > 0 &&
          list.length === 0 &&
          !pending && <Info text="Nothing found" />}
      </section>
    </Wrap>
  );
};

export default Home;
