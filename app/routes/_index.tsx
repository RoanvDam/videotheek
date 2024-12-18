import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import { json } from "@remix-run/node";

const prisma = new PrismaClient();

export const meta: MetaFunction = () => {
  return [
    { title: "Videotheek" },
    { name: "description", content: "Stageopdracht" },
  ];
};

export const loader = async () => {
  const movies = await prisma.movies.findMany();
  return json({ movies });
};

export default function Index() {
  const { movies } = useLoaderData<typeof loader>();
  return (
    <>
    <div className="flex justify-center">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {
          movies.map(
            (movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                  
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{movie.title}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">Genre: {movie.genre}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Release Year: {movie.releaseYear}</p>
                <p className="font-normal text-gray-700 h-24 truncate dark:text-gray-400">Description: {movie.description}</p>
                <Link to={`/movies/${movie.id}/edit`}>
                  <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
                </Link>
                <Link to={`/movies/${movie.id}/delete`}>
                  <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
                </Link>
              </Link>
            )
          )
        }
      </div>
    </div>
    </>
  );
}