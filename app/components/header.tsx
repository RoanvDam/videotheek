import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()



export default function Header() {
    return (
    <>
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Videotheek</span>
          </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link aria-label="add-movie-button" to="newMovie">
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add movie</button>
          </Link>
        </div>
        </div>
    </nav>
    <div className="h-[50px]"></div>
    </>
    );
  }