const port = 25522;
const host = "127.0.0.1";
const api = `http://${host}:${port}`;

post();

function post(url, body) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  })
    .then((response) => response.json())
    .then((body) => {
      console.log(body);
    });
}
