import { Webdata } from "@/data/data"
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const webdata = Webdata;
    console.log("data api requested");
    return NextResponse.json(webdata);
  } catch (error: any) {
    console.error("Data API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
};