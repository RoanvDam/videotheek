import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Form, useNavigation, useLoaderData, useSubmit } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";

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
  const movies = q ?
  await prisma.movies.findMany({
    where: {
      releaseYear: {
        gte: Number(minYear) || 1900,
        lte: Number(maxYear) || currentYear,
      },
      title: {
        contains: q,
      }
    },
  }) : await prisma.movies.findMany({
    where: {
      releaseYear: {
        gte: Number(minYear) || 1900,
        lte: Number(maxYear) || currentYear,
      }
    }
  });

  return json({ movies, q, minYear, maxYear });
};

export default function Index() {
  const { movies, q, minYear, maxYear } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();

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
      )
    ;

  const [query, setQuery] = useState(q || "");
  const [queryMinYear, setMinQuery] = useState(minYear || "");
  const [queryMaxYear, setMaxQuery] = useState(maxYear || "");

    useEffect(() => {
      setQuery(q || "");
    }, [q]);

    useEffect(() => {
      setMinQuery(minYear || "");
    }, [minYear]);

    useEffect(() => {
      setMaxQuery(maxYear || "");
    }, [maxYear]);
  

    if (!movies) {
      return <p>Loading movies...</p>;
    }
  return (
    <>
    <h1 className="text-center text-xl mb-4">Look up movie</h1>
    <Form
      id="search-form"
      className="flex justify-around"
      onChange={(event) => {
        submit(event.currentTarget, { replace: true });
      }}
      role="search"
    >
      <input
        aria-label="Search movies"
        className={searching ? "loading" : ""}
        id="q"
        name="q"
        onChange={(event) => setQuery(event.currentTarget.value)} // Synchronize with local state
        placeholder="Search"
        type="search"
        value={query || ""} // Blank if no query
      />
      <input
        aria-label="Search min year"
        className={searching ? "loading" : ""}
        id="minYear"
        name="minYear"
        onChange={(event) => setMinQuery(event.currentTarget.value)} // Synchronize with local state
        placeholder="Min year" // Placeholder shown when no value
        type="number"
        value={queryMinYear || ""} // Blank if no user input
      />
      <input
        aria-label="Search max year"
        className={searching ? "loading" : ""}
        id="maxYear"
        name="maxYear"
        onChange={(event) => setMaxQuery(event.currentTarget.value)} // Synchronize with local state
        placeholder="Max year" // Placeholder shown when no value
        type="number"
        value={queryMaxYear || ""} // Blank if no user input
      />
    </Form>


    <div className="m-4 flex justify-center">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {
        (movies.length > 0) ?
          movies.map(
            (movie) => (
              <div
                key={movie.id}
                className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                  
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{movie.title}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">Genre: {movie.genre}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Release Year: {movie.releaseYear}</p>
                <p className="font-normal text-gray-700 h-20 truncate dark:text-gray-400">Description: {movie.description}</p>
                <div className=" flex justify-center">
                  <Link to={`/movies/${movie.id}/edit`}>
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
                  </Link>
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
          ) : <p>No movies found</p>
        }
      </div>
    </div>
    </>
  );
}