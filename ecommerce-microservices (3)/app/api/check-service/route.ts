import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Tentative de connexion au service
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        Accept: "application/json",
      },
      // Timeout court pour éviter d'attendre trop longtemps
      signal: AbortSignal.timeout(5000),
    })

    return NextResponse.json({
      url,
      status: response.status,
      ok: response.ok,
    })
  } catch (error) {
    // En cas d'erreur (timeout, connexion refusée, etc.)
    return NextResponse.json({
      url,
      error: error.message,
      ok: false,
    })
  }
}
