import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthenticated" }), {
        status: 401,
      });
    }

    if (!label) {
      return new NextResponse(
        JSON.stringify({ message: "Label is required" }),
        {
          status: 400,
        }
      );
    }

    if (!imageUrl) {
      return new NextResponse(
        JSON.stringify({ message: "Image URL is required" }),
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Billboard successfully created", billboard }),
      { status: 200 }
    );
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}