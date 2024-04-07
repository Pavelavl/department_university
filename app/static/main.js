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
for (const key in selectContainersNames) {
    selectContainersNames[key] = selectContainersNames[key].map(el => {
        return document.getElementById(el);
    })
}

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);

        // Remove active class from all tabs and tab contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and its corresponding content
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
    })
        .then((response) => response.json());
}

function init() {
    Object.keys(selectContainersNames).forEach((tableName) => {
        post("/get_data", {
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
