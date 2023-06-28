export default defineEventHandler((event) => {
  console.log(
    getMethod(event) +
      " " +
      getRequestPath(event) +
      " " +
      getResponseStatus(event)
  );
});
