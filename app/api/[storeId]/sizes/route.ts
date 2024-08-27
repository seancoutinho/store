import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthenticated" }), {
        status: 401,
      });
    }

    if (!name) {
      return new NextResponse(
        JSON.stringify({ message: "Name is required" }),
        {
          status: 400,
        }
      );
    }

    if (!value) {
      return new NextResponse(
        JSON.stringify({ message: "Value of size is required" }),
        {
          status: 400,
        }
      );
    }

    if (!params.storeId) {
      return new NextResponse(
        JSON.stringify({ message: "Store ID is required" }),
        {
          status: 400,
        }
      );
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if(!storeByUserId) {
        return new NextResponse(
          JSON.stringify({ message: "Unauthorized" }),
          {
            status: 403,
          }
        );
    }

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Billboard successfully created", size }),
      { status: 200 }
    );
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    if (!params.storeId) {
      return new NextResponse(
        JSON.stringify({ message: "Store ID is required" }),
        {
          status: 400,
        }
      );
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      }
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}