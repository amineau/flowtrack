import strava from "strava-v3";

export default eventHandler(async (event) => {
  const accessToken = event.context.session?.accessToken;
  const response = await strava.athlete.get({ access_token: accessToken });
  return response.data;
});
