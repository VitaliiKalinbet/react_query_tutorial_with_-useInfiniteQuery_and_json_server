import React, {useState} from "react";
import { useInfiniteQuery } from "react-query";
import AddTodo from './components/AddTodo';

const fetchAllTodos = async () => {
  const res = await fetch('http://localhost:3001/todo');
  return res.json();
};

const fetchTodos = async (key, pageNumber = 1, disableButtonLoadMore) => {
  //this is a crutch because the server does not return the next page presence parameter - start:
  if(disableButtonLoadMore) {
    return fetchAllTodos();
  }
  //this is a crutch because the server does not return the next page presence parameter - end.

  const url = `http://localhost:3001/todo?_page=${pageNumber}&_limit=2`;
  const res = await fetch(url);
  return res.json();
};

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [disableButtonLoadMore, setDisableButtonLoadMore] = useState(false);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("todos", (key) => fetchTodos(key, pageNumber, disableButtonLoadMore), {
    getNextPageParam: async (lastPage, pages) => {
      //this is a crutch because the server does not return the next page presence parameter:
      if (disableButtonLoadMore) {
        return;
      }
      const res = await fetchAllTodos();
      if(res.length / 2 > pageNumber) {
        setDisableButtonLoadMore(false);
      } else {
        setDisableButtonLoadMore(true);
      }
    },
  });

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error}</p>;
  }

  console.log('data :>> ', data);
  console.log('fetchNextPage :>> ', fetchNextPage);
  console.log('hasNextPage :>> ', hasNextPage);
  console.log('isFetching :>> ', isFetching);
  console.log('isFetchingNextPage :>> ', isFetchingNextPage);

  return (
    <>
    {/* <AddTodo/> */}
      <ul>
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.map(el => {
              return <li key={el.id}>{el.title}</li>
            })}
          </React.Fragment>
        ))}
      </ul>

      <div>
         <button
           onClick={async() => {
            await setPageNumber(old => old + 1);
            fetchNextPage();
           }}
            //this is a crutch:
            className={disableButtonLoadMore ? 'disableButton' : 'button'}
            disabled={disableButtonLoadMore}
            /* this good with real server:
              disabled={!hasNextPage || isFetchingNextPage} */
         >
           {isFetchingNextPage
             ? 'Loading more...'
             : hasNextPage
             ? 'Load More'
             : 'Nothing more to load'}
         </button>
       </div>
       <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  );
}

export default App;
