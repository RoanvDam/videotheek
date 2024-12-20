import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  // delete query
  const deletedMovie = await prisma.movies.delete({
    where: {
        id: Number(params.movieId)
    },
  });
  return redirect("/");
};