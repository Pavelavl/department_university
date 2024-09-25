const port = 25522;
const host = "localhost";
const api = `http://${host}:${port}`;
const selectContainersNames = {
    departments: [
        "teacher_department_id",
        "student_department_id",
        "course_department_id",
        "subject_department_id",
        "event_department_id",
        "department_id",
    ],
    courses: [
        "groups_course_id",
        "schedules_course_id",
        "materials_course_id",
        "plans_course_id",
        "course_id",
    ],
    students: [
        "grades_student_id",
        "sheets_student_id",
        "projects_student_id",
        "student_id",
    ],
    subjects: [
        "grades_subject_id",
        "schedules_subject_id",
        "teacher_subject_id",
        "subject_id",
    ],
    groups: [
        "schedules_group_id"
    ],
    teachers: [
        "schedules_teacher_id",
        "subjects_teacher_id",
        "researches_teacher_id",
        "teacher_id",
    ],
    classrooms: [
        "schedules_classroom_id",
    ],
    curriculums: [
        "curriculum_id",
    ],
    languages: [
        "language_id",
    ],
}
const getsDict = Object.keys(selectContainersNames).reduce((acc, el) => {
    acc[el] = [];
    return acc;
}, {});
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const updDelContainer = document.getElementById("upd_del");
const buttons  = document.querySelectorAll('[type=submit]');
buttons.forEach(button => {
    button.addEventListener('click', ($event) => {
        $event.preventDefault();
        const table = button.dataset.table;
        const now = (new Date()).toUTCString();
        const inputs = [
            ...button.parentElement.getElementsByTagName('input'),
            ...button.parentElement.getElementsByTagName('select'),
            ...button.parentElement.getElementsByTagName('textarea'),
        ];
        const columnsValues = inputs.reduce((acc, input) => {
            acc[input.name] = input.value;
            return acc;
        }, {});
        
        for (const key in columnsValues) {
            if (columnsValues[key] == "") {
                alert('Please fill in all fields');
                return;
            }
        }
        columnsValues.created_at = now;

        post("/query", {
            query: `
            INSERT INTO ${table} (${Object.keys(columnsValues).join(", ")}) VALUES (${Object.values(columnsValues).map(e => {
                if (typeof e == "string") return "'" + e + "'"
                return e;
            }).join(", ")})`,
        }).then(res => {
            alert(`Element successfully added into table ${table}.\n ${JSON.stringify(columnsValues, null, 4)}`)
        });
    });
});

for (const key in selectContainersNames) {
    selectContainersNames[key] = selectContainersNames[key].map(el => {
        return document.getElementById(el);
    })
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
 
        tab.classList.add('active');
        target.classList.add('active');
    });
});

init();

function post(url, body) {
    return fetch(`${api}${url}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).catch(err => {
        alert("Error occured: " + err);
    }).then((response) => response.json());
}

function init() {
    [].slice.call(document.getElementsByTagName('form')).map((form) => form.dataset.table).forEach((tableName) => {
        post("/query", {
            query: `SELECT *
                    FROM ${tableName}`,
        }).then((data) => {
            getsDict[tableName] = data.rows;
            switch (tableName) {
                case "departments":
                    fillSelectContainersWithOptions(tableName, data.rows, "title", "department_id");
                    break;
                case "courses":
                    fillSelectContainersWithOptions(tableName, data.rows, "course_name", "course_id");
                    break;
                case "students":
                    fillSelectContainersWithOptions(tableName, data.rows, "first_name", "student_id");
                    break;
                case "subjects":
                    fillSelectContainersWithOptions(tableName, data.rows, "subject_name", "subject_id");
                    break;
                case "groups":
                    fillSelectContainersWithOptions(tableName, data.rows, "group_name", "group_id");
                    break;
                case "teachers":
                    fillSelectContainersWithOptions(tableName, data.rows, "first_name", "teacher_id");
                    break;
                case "classrooms":
                    fillSelectContainersWithOptions(tableName, data.rows, "classroom_number", "classroom_id");
                    break;
                case "curriculums":
                    fillSelectContainersWithOptions(tableName, data.rows, "curriculum_name", "curriculum_id");
                    break;
                case "languages":
                    fillSelectContainersWithOptions(tableName, data.rows, "language_name", "language_id");
                    break;
            }

            const jsonElementOuter = document.createElement("div");
            jsonElementOuter.style.display = "flex";
            jsonElementOuter.style.justifyContent = "center";
            jsonElementOuter.style.width = "100%";
            
            const jsonElement = document.createElement("pre");
            jsonElement.textContent = tableName;
            jsonElementOuter.appendChild(jsonElement);
            updDelContainer.appendChild(jsonElementOuter);

            if (data.rows.length === 0) {
                const noData = document.createElement("p");
                noData.textContent = "No data found.";
                updDelContainer.appendChild(noData);
            }
            data.rows.forEach(el => {
                const container = document.createElement("form");

                const jsonEditor = document.createElement("textarea");
                jsonEditor.style.width = "100%";
                jsonEditor.rows = 10;
                jsonEditor.dataset.json = JSON.stringify(el);
                jsonEditor.value = JSON.stringify(el, null, 4);
                container.appendChild(jsonEditor);

                const buttons = document.createElement("div");
                buttons.style.display = "flex";
                buttons.style.justifyContent = "center";

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", ($event) => {
                    $event.preventDefault();
                    post("/query", {
                        query: `DELETE FROM ${tableName} WHERE ${Object.keys(el)[0]} = ${Object.values(el)[0]}`,
                    }).then(res => {
                        updDelContainer.removeChild(container);
                        alert(`Element successfully deleted from table ${tableName}.\n ${JSON.stringify(el, null, 4)}`);
                    });
                });
                buttons.appendChild(deleteButton);

                const updateButton = document.createElement("button");
                updateButton.textContent = "Update";
                updateButton.addEventListener("click", ($event) => {
                    $event.preventDefault();
                    const jsonEditor = container.querySelector("textarea");
                    let json = null;
                    try {
                        json = JSON.parse(jsonEditor.value);
                    } catch (err) {
                        alert("Error occured while parsing JSON string, check your input.");
                        return;
                    }
                    if (Object.keys(json).length !== Object.keys(el).length) {
                        alert("Incorrect input.");
                    }
                    post("/query", {
                        query: `UPDATE ${tableName} SET ${Object.entries(json).slice(1).map(([key, value]) => 
                            `${key} = ${typeof value == 'string' ? "'" + value + "'" : value}`)
                            .join(", ")} WHERE ${Object.keys(json)[0]} = ${Object.values(json)[0]}`,
                    }).then(res => {
                        alert(`Element successfully updated in table ${tableName}.
                        \nOld: ${JSON.stringify(el, null, 4)}\nNew: ${JSON.stringify(json, null, 4)}`);
                    });
                });
                buttons.appendChild(updateButton);

                container.appendChild(buttons);
                updDelContainer.appendChild(container);
            });
        });
    });
}

function fillSelectContainersWithOptions(key, data, innerHtml, value) {
    const containers = selectContainersNames[key];
    containers.map(container => {
        const resultOptions = [];
        data.forEach(el => {
            const option = document.createElement('option');
            option.innerHTML = el[innerHtml];
            option.value = el[value];
            resultOptions.push(option);
        });
        container.append(...resultOptions);
        return container;
    });
}
