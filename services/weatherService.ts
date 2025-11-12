
export async function fetchWeatherData(latitude: number, longitude: number): Promise<any> {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&past_days=2&forecast_days=2&timezone=Asia%2FTokyo`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.reason || `API request failed with status ${response.status}`);
  }

  return response.json();
}
