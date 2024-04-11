-- Таблица кафедр
CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into departments (department_id, title, created_at, updated_at) values (1, 'title 1', now(), now());
insert into departments (department_id, title, created_at, updated_at) values (2, 'title 2', now(), now());
insert into departments (department_id, title, created_at, updated_at) values (3, 'title 3', now(), now());

-- Таблица преподавателей
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into teachers (first_name, last_name, department_id, created_at, updated_at) values ('Pavel', 'Teacher', 1, now(), now());
insert into teachers (first_name, last_name, department_id, created_at, updated_at) values ('Kirillov', 'Teacher', 2, now(), now());
insert into teachers (first_name, last_name, department_id, created_at, updated_at) values ('Nikita', 'Teacher', 3, now(), now());
insert into teachers (first_name, last_name, department_id, created_at, updated_at) values ('Gleb', 'Teacher', 1 now(), now());

-- Таблица студентов
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into students (first_name, last_name, department_id, created_at, updated_at) values ('Pavel', 'Nevzorov', 1, now(), now());
insert into students (first_name, last_name, department_id, created_at, updated_at) values ('Kirillov', 'Vladislav', 2, now(), now());
insert into students (first_name, last_name, department_id, created_at, updated_at) values ('Nikita', 'Bogdanov', 3, now(), now());
insert into students (first_name, last_name, department_id, created_at, updated_at) values ('Gleb', 'Vinogradov', 2, now(), now());

-- Таблица курсов
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(50),
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into courses (course_name, department_id, created_at, updated_at) values ('Course 1', 1, now(), now());
insert into courses (course_name, department_id, created_at, updated_at) values ('Course 2', 2, now(), now());
insert into courses (course_name, department_id, created_at, updated_at) values ('Course 3', 3, now(), now());

-- Таблица групп
CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(50),
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into groups (group_name, course_id, created_at, updated_at) values ('Group 1', 1, now(), now());
insert into groups (group_name, course_id, created_at, updated_at) values ('Group 2', 2, now(), now());
insert into groups (group_name, course_id, created_at, updated_at) values ('Group 3', 3, now(), now());
insert into groups (group_name, course_id, created_at, updated_at) values ('Group 4', 1, now(), now());

-- Таблица предметов
CREATE TABLE IF NOT EXISTS subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(50),
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into subjects (subject_name, department_id, created_at, updated_at) values ('Subject 1', 1, now(), now());
insert into subjects (subject_name, department_id, created_at, updated_at) values ('Subject 2', 2, now(), now());
insert into subjects (subject_name, department_id, created_at, updated_at) values ('Subject 3', 3, now(), now());
insert into subjects (subject_name, department_id, created_at, updated_at) values ('Subject 4', 1, now(), now());

-- Таблица оценок
CREATE TABLE IF NOT EXISTS grades (
    grade_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(subject_id) ON DELETE CASCADE,
    grade_value INT,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица аудиторий
CREATE TABLE IF NOT EXISTS classrooms (
    classroom_id SERIAL PRIMARY KEY,
    classroom_number VARCHAR(10),
    capacity INT,
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into classrooms (classroom_number, capacity, created_at, updated_at) values ('GB54', 25, now(), now());
insert into classrooms (classroom_number, capacity, created_at, updated_at) values ('DG34', 35, now(), now());
insert into classrooms (classroom_number, capacity, created_at, updated_at) values ('A1', 245, now(), now());
insert into classrooms (classroom_number, capacity, created_at, updated_at) values ('B2', 125, now(), now());

-- Таблица расписания
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id),
    group_id INT REFERENCES groups(group_id),
    subject_id INT REFERENCES subjects(subject_id),
    teacher_id INT REFERENCES teachers(teacher_id),
    classroom_id INT REFERENCES classrooms(classroom_id),
    day_of_week VARCHAR(15),
    start_time TIME,
    end_time TIME,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица типов занятий
CREATE TABLE IF NOT EXISTS lesson_types (
    lesson_type_id SERIAL PRIMARY KEY,
    lesson_type_name VARCHAR(50),
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица распределения преподавателей по предметам
CREATE TABLE IF NOT EXISTS teacher_subjects (
    teacher_subject_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(subject_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица материалов курсов
CREATE TABLE IF NOT EXISTS course_materials (
    material_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    material_name VARCHAR(100),
    material_url VARCHAR(255),
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица событий (мероприятий) на кафедре
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(100),
    event_date DATE,
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица преподаваемых языков
CREATE TABLE IF NOT EXISTS languages (
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR(50),
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into languages (language_name, created_at, updated_at) values ('Russian', now(), now());
insert into languages (language_name, created_at, updated_at) values ('Deutch', now(), now());
insert into languages (language_name, created_at, updated_at) values ('English', now(), now());

-- Таблица исследований преподавателей
CREATE TABLE IF NOT EXISTS teacher_research (
    research_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    research_title VARCHAR(100),
    research_description TEXT,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица стажировок преподавателей
CREATE TABLE IF NOT EXISTS teacher_internships (
    internship_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    internship_organization VARCHAR(100),
    internship_duration INT,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица учебных программ
CREATE TABLE IF NOT EXISTS curriculums (
    curriculum_id SERIAL PRIMARY KEY,
    curriculum_name VARCHAR(100),
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into curriculums (curriculum_name, department_id, created_at, updated_at) values ('Curriculum 1', 1, now(), now());
insert into curriculums (curriculum_name, department_id, created_at, updated_at) values ('Curriculum 2', 2, now(), now());
insert into curriculums (curriculum_name, department_id, created_at, updated_at) values ('Curriculum 3', 3, now(), now());
insert into curriculums (curriculum_name, department_id, created_at, updated_at) values ('Curriculum 4', 1, now(), now());

-- Таблица учебных планов
CREATE TABLE IF NOT EXISTS study_plans (
    study_plan_id SERIAL PRIMARY KEY,
    curriculum_id INT REFERENCES curriculums(curriculum_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(subject_id) ON DELETE CASCADE,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица оценочных листов
CREATE TABLE IF NOT EXISTS grade_sheets (
    grade_sheet_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    grades_json JSONB,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица проектов студентов
CREATE TABLE IF NOT EXISTS student_projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(100),
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    project_description TEXT,
    created_at timestamptz not null,
    updated_at timestamptz
);
-- Таблица иностранных языков
CREATE TABLE IF NOT EXISTS foreign_languages (
    foreign_language_id SERIAL PRIMARY KEY,
    language_id INT REFERENCES languages(language_id) ON DELETE CASCADE,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20),
    created_at timestamptz not null,
    updated_at timestamptz
);
insert into foreign_languages (language_id, student_id, proficiency_level, created_at, updated_at) values (1, 1, 5, now(), now());
insert into foreign_languages (language_id, student_id, proficiency_level, created_at, updated_at) values (2, 2, 4, now(), now());
insert into foreign_languages (language_id, student_id, proficiency_level, created_at, updated_at) values (3, 3, 3, now(), now());
