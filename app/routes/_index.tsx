import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { Form, useNavigation, useLoaderData, useSubmit } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const prisma = new PrismaClient();

export const meta: MetaFunction = () => {
  return [
    { title: "Videotheek" },
    { name: "description", content: "Stageopdracht" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const currentYear = Number(new Date().getFullYear());
  const q = url.searchParams.get("q") || "";
  const minYear = url.searchParams.get("minYear");
  const maxYear = url.searchParams.get("maxYear");

  // shows takeNumber movies per page and skips per skipNumber
  const takeNumber = 4;
  const skipNumber = Number(url.searchParams.get("skip")) * takeNumber || 0;


  // SQL query
  const movies = 
  // if title is searched
  q ?
  await prisma.movies.findMany({
    take: takeNumber,
    skip: skipNumber,
    where: {
      releaseYear: {
        gte: Number(minYear) || 1900,
        lte: Number(maxYear) || currentYear,
      },
      title: {
        contains: q,
      }
    },
    orderBy: {
      id: 'asc',
    },
  })
  // if title isn't searched
  :
  await prisma.movies.findMany({
    take: takeNumber,
    skip: skipNumber,
    where: {
      releaseYear: {
        gte: Number(minYear) || 1900,
        lte: Number(maxYear) || currentYear,
      }
    },
    orderBy: {
      id: 'asc',
    },
  });

  // get the count of how many movies are selected
  let totalSkips =
  // if title is searched
  q ?
  await prisma.movies.count({
    where: {
      releaseYear: {
        gte: Number(minYear) || 1900,
        lte: Number(maxYear) || currentYear,
      },
      title: {
        contains: q,
      }
    }
  })
  // if title isn't searched
  :
  await prisma.movies.count({
    where: {
      releaseYear: {
        gte: Number(minYear) || 1900,
        lte: Number(maxYear) || currentYear,
      }
    },
  });

  // divert resultCount to how many skips can happen for the query
  totalSkips = Math.ceil(totalSkips / takeNumber) - 1;

  return json({ movies, totalSkips, q, minYear, maxYear });
};

// index page
export default function Index() {
  const { movies, totalSkips, q, minYear, maxYear } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const location = useLocation();
  const navigate = useNavigate();

  // set the url for search functino
  const searching =
      navigation.location &&
      new URLSearchParams(navigation.location.search).has(
        "q"
      ) &&
      new URLSearchParams(navigation.location.search).has(
        "minYear"
      ) &&
      new URLSearchParams(navigation.location.search).has(
        "max"
      ) && 
      new URLSearchParams(navigation.location.search).has(
        "skip"
      )
    ;

  // keep the query as a state
  const [query, setQuery] = useState(q || "");
  const [queryMinYear, setMinQuery] = useState(minYear || "");
  const [queryMaxYear, setMaxQuery] = useState(maxYear || "");

  // saves url for returning from other pages/routes or for refreshing the page
    useEffect(() => {
      setQuery(q || "");
    }, [q]);

    useEffect(() => {
      setMinQuery(minYear || "");
    }, [minYear]);

    useEffect(() => {
      setMaxQuery(maxYear || "");
    }, [maxYear]);

    // add skip to URL if button next page is clicked;
    const addSkip = () => {
      const params = new URLSearchParams(location.search);
      let currentSkip = Number(params.get('skip') || '0');

      currentSkip += 1;

      if (currentSkip > totalSkips) {
        currentSkip = totalSkips
      }
  
      // Set the "value" parameter
      params.set('skip', `${currentSkip}`);
  
      // Create the new URL with skip
      const newUrl = `${location.pathname}?${params.toString()}`;
  
      // set new url
      navigate(newUrl);
    };

    // remove 1 skip from the URL if button previous page is clicked
    const removeSkip = () => {
      const params = new URLSearchParams(location.search);
      let currentSkip = Number(params.get('skip') || '0');

      currentSkip -= 1;

      if (currentSkip < 0) {
        currentSkip = 0
      }
  
      // Set the "value" parameter
      params.set('skip', `${currentSkip}`);
  
      // Create the new URL with the updated query params
      const newUrl = `${location.pathname}?${params.toString()}`;
  
      // Navigate to the updated URL
      navigate(newUrl);
    };

  return (
    <>
    <Form
      id="search-form"
      className="flex justify-around flex-col sm:flex-row"
      onChange={(event) => {
        submit(event.currentTarget, { replace: true });
      }}
      role="search"
    >
      {/* search for title name */}
      <div className="flex flex-col">
        <label htmlFor="q">search for Title</label>
        <input
          aria-label="Search movies"
          className={searching ? "loading" : ""}
          id="q"
          name="q"
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search"
          type="search"
          value={query || ""}
        />
      </div>


      <div className="flex flex-col">
        {/* search for minimum year  */}
        <label htmlFor="minYear">select by year</label>
        <input
          aria-label="Search min year"
          className={searching ? "loading" : ""}
          id="minYear"
          name="minYear"
          onChange={(event) => setMinQuery(event.currentTarget.value)}
          placeholder="Min year"
          type="number"
          value={queryMinYear || ""}
        />
        {/* search for maximum year  */}
        <input
          aria-label="Search max year"
          className={searching ? "loading" : ""}
          id="maxYear"
          name="maxYear"
          onChange={(event) => setMaxQuery(event.currentTarget.value)}
          placeholder="Max year"
          type="number"
          value={queryMaxYear || ""}
        />
      </div>
    </Form>


    <div className="m-4 flex justify-center">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {
        (movies.length > 0) ?
        // if movies are found
          movies.map(
            (movie) => (
              <div
                key={movie.id}
                className="block max-w-xs sm:w-xs p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                  
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{movie.title}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">Genre: {movie.genre}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Release Year: {movie.releaseYear}</p>
                <p className="font-normal text-gray-700 h-20 truncate dark:text-gray-400">Description: {movie.description}</p>
                <div className=" flex justify-center">
                  {/* edit button */}
                  <Link to={`/movies/${movie.id}/edit`}>
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
                  </Link>
                  {/* delete button */}
                  <Form
                    action={`/movies/${movie.id}/delete`}
                    method="post"
                    onSubmit={(event) => {
                      const response = confirm(
                        "Are you sure you want to delete this movie?"
                      );
                      if (!response) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <button type="submit" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
                  </Form>
                </div>
              </div>
            )
          )
          // if there are no movies found
          : <p>No movies found...</p>
        }
      </div>
    </div>

    <div className="flex justify-center">
      <div className="flex">
        {/* Previous Button */}
        <button onClick={removeSkip} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          Previous
        </button>

        {/* Next Button */}
        <button onClick={addSkip} className="flex items-center justify-center px-3 h-8 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          Next
        </button>
      </div>
    </div>
    </>
  );
}