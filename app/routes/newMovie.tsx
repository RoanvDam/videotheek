import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useNavigate,
  useActionData,
} from "@remix-run/react";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const action = async ({ request } : ActionFunctionArgs) => {
  const formData = await request.formData();
  const dataFromForm = Object.fromEntries(formData);

  const errors = {} as { releaseYear: string };;
  if (Number(dataFromForm.releaseYear) < 1900) {
    errors.releaseYear = "Release year must be more than 1900";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  const newMovie = await prisma.movies.create({
    data: {
      title: String(dataFromForm.title),
      genre: String(dataFromForm.genre),
      releaseYear: Number(dataFromForm.releaseYear),
      description: String(dataFromForm.description),
    },
  });
  return redirect(`/`);
}

export default function addForm() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  return (
    

    <Form className="max-w-sm mx-auto" method="post">
      <div className="mb-5">
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
        <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="mb-5">
          <label htmlFor="genre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Genre</label>
          <input type="text" id="genre" name="genre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="mb-5">
          <label htmlFor="releaseYear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Release Year</label>
          <input type="number" id="releaseYear" name="releaseYear" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
      </div>
      {actionData?.errors?.releaseYear ? (
          <em className="mt-2 text-sm text-red-600 dark:text-red-500">{actionData?.errors.releaseYear}</em>
        ) : null}
      <div className="mb-5">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <input type="text" id="description" name="description" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
    </Form>

  );
}
