// import { PrismaClient } from '@prisma/client';
// import { useLoaderData } from '@remix-run/react';

// const prisma = new PrismaClient()

// async function main() {

//     // npx prisma studio        # print in TERMINAL to SHOW DATABASE
//     // npx tsx script.ts        # print in TERMINAL to EXECUTE SCRIPT


    // search function
    // const movie = await prisma.movies.findMany({
    //   where: {
    //     title: {
    //       contains: "ge",
    //     },
    //   },
    // });
    // console.log("movie selected:", movie);

//     // DELETE FUNCTION
//     // const deletedMovie = await prisma.movies.delete({
//     //   where: { id: 1 },
//     // });
//     // console.log("Deleted Movie:", deletedMovie);


//     // UPDATE MOVIE
//     // const updatedMovie = await prisma.movies.update({
//     //   where: { id: 2 }, // Update movie with id = 2
//     //   data: {
//     //     releaseYear: 2012, 
//     //   },
//     // });

//     // const newMovie = await prisma.movies.create({
//     //   data: {
//     //     title: "Inception",
//     //     genre: "Sci-Fi",
//     //     releaseYear: 2010, // Store as an integer
//     //     description: "A mind-bending thriller about dream manipulation.",
//     //   },
//     // });
//     // console.log("New Movie Added:", newMovie);
//     // CREATE FUNCTION
// }

// export const printMovies = async () => {
//   // SELECT FUNCTION
//   const movies = await prisma.movies.findMany();
//   return movies;
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })