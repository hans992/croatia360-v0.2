import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Split";
  const date = searchParams.get("date"); // YYYY-MM-DD

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API not configured" },
      { status: 503 }
    );
  }

  if (!date) {
    return NextResponse.json(
      { error: "Missing date parameter" },
      { status: 400 }
    );
  }

  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},HR&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    if (!geoData?.[0]) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const { lat, lon } = geoData[0];
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    if (forecastData.cod !== "200") {
      return NextResponse.json(
        { error: forecastData.message || "Forecast failed" },
        { status: 500 }
      );
    }

    const targetDate = date.slice(0, 10);
    const dayForecasts = (forecastData.list || []).filter(
      (f: { dt_txt?: string }) => f.dt_txt?.startsWith(targetDate)
    );

    const hasRain = dayForecasts.some(
      (f: { weather?: { main?: string }[] }) =>
        f.weather?.some((w) =>
          ["Rain", "Drizzle", "Thunderstorm"].includes(w.main || "")
        )
    );

    const avgTemp =
      dayForecasts.length > 0
        ? dayForecasts.reduce(
            (s: number, f: { main?: { temp?: number } }) =>
              s + (f.main?.temp ?? 0),
            0
          ) / dayForecasts.length
        : null;

    return NextResponse.json({
      city,
      date: targetDate,
      hasRain,
      avgTemp: avgTemp ? Math.round(avgTemp) : null,
    });
  } catch (err) {
    console.error("[weather]", err);
    return NextResponse.json(
      { error: "Weather fetch failed" },
      { status: 500 }
    );
  }
}
