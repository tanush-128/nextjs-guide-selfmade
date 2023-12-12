import { NextResponse } from "next/server";
import getHandler from "./CRUD/create";
import postHandler from "./CRUD/post";
import puthHandler from "./CRUD/put";
import deleteHandler from "./CRUD/delete";

export const GET = getHandler;

export const POST = postHandler;

export const PUT = puthHandler;

export const DELETE = deleteHandler;

