import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const GET = withApiAuthRequired(async (req, res) => {
  try {
    const { accessToken } = await getAccessToken(req, res);

    const externalRes = await fetch(`${process.env.API_DOMAIN}/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await externalRes.json();

    if (data) {
      return NextResponse.json(data);
    }
  } catch (error) {
    const message = "Something went wrong";

    return NextResponse.json(message, { status: 500 });
  }
});

export { GET };
