const port = 25522;
const host = "192.168.0.100";
const api = `http://${host}:${port}`;
const gets = [
  "departments",
  "courses",
  "students",
  "subjects",
  "groups",
  "teachers",
  "classrooms",
  "curriculums",
  "foreign_languages",
  "languages",
];
const getsDict = gets.reduce((acc, el) => {
  acc[el] = [];
  return acc;
}, {});

init();

function post(url, body) {
  return fetch(`${api}${url}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function init() {
  gets.forEach((tableName) => {
    post("/get_data", {
      query: `SELECT * FROM ${tableName};`,
    }).then((data) => {
      getsDict[tableName] = data;
    });
  });
}
