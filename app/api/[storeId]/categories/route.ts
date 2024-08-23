import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

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

    if (!billboardId) {
      return new NextResponse(
        JSON.stringify({ message: "Billboard ID is required" }),
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

    if (!storeByUserId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Category successfully created", category }),
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
