---------------------------------------------
-- Schema Definition for CS1660 Final Project: Git It Done
-- Authors: Madeleine Lasky, Alexandra Butler, Emma Tristano
---------------------------------------------
DROP SCHEMA IF EXISTS GitItDoneDB CASCADE;
CREATE SCHEMA GitItDoneDB;
SET search_path TO GitItDoneDB;

-- STUDENT (studentID, firstName, lastName, email, password)
-- DESCRIPTION: List of students and their information.
CREATE TABLE STUDENT
(
    studentID        SERIAL,
    firstName        VARCHAR(20) NOT NULL,
    lastName         VARCHAR(20) NOT NULL,
    email            VARCHAR(20) NOT NULL,
    password         VARCHAR(20) NOT NULL,

    CONSTRAINT PK_STUDENT PRIMARY KEY (studentID),
    CONSTRAINT UN_STUDENT_EMAIL UNIQUE (email)
);

-- PROFESSOR (professorID, firstName, lastName, email, password)
-- DESCRIPTION: List of professors and their information.
CREATE TABLE PROFESSOR
(
    professorID         SERIAL,
    firstName           VARCHAR(20) NOT NULL,
    lastName            VARCHAR(20) NOT NULL,
    email               VARCHAR(20) NOT NULL,
    password            VARCHAR(20) NOT NULL,

    CONSTRAINT PK_PROFESSOR_ID PRIMARY KEY (professorID),
    CONSTRAINT UN_PROFESSOR_EMAIL UNIQUE (email)
);

-- COURSES (courseID, courseName)
-- ASSUMPTION: Course IDs may be strings such as 'CS1660' for instance.
-- DESCRIPTION: List of courses and their corresponding course names.
CREATE TABLE COURSE
(
    courseID               VARCHAR(20),
    courseName             VARCHAR(40) NOT NULL,

    CONSTRAINT PK_COURSE PRIMARY KEY (courseID)
);

-- SECTIONS (sectionNo, courseID, professorID)
-- ASSUMPTION: A course can have multiple sections and each section can be taught by a different
--             instructor. Additionally, section numbers may repeat across courses i.e. CS1660
--             and C1555 may both have a 1000 section. Therefore, primary key of sectionNo
--             and courseID guarantees uniqueness.
-- DESCRIPTION: List of sections for each course and professor that teaches specific section.
CREATE TABLE SECTIONS
(
    sectionNo             INTEGER,
    courseID              VARCHAR(20),
    professorID           INTEGER NOT NULL,

    CONSTRAINT PK_SECTIONS PRIMARY KEY (sectionNo, courseID),
    CONSTRAINT FK_SECTIONS_COURSE FOREIGN KEY (courseID) REFERENCES COURSE (courseID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT FK_SECTIONS_PROFESSOR FOREIGN KEY (professorID) REFERENCES PROFESSOR (professorID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ROSTER(sectionNo, courseID, studentID)
-- ASSUMPTION: Section numbers may repeat across different courses. Therefore,
--             sectionNo and studentID as a PK do not guarantee uniqueness. However,
--             courseID, sectionNo, and studentID guarantee uniqueness.
-- DESCRIPTION: Enrollment list of students for each section of each course.
CREATE TABLE ROSTER
(
    sectionNo          INTEGER,
    courseID           VARCHAR(20),
    studentID          INTEGER,

    CONSTRAINT PK_ROSTER PRIMARY KEY (sectionNo, courseID, studentID),
    CONSTRAINT FK_ROSTER_SECTION FOREIGN KEY (sectionNo, courseID) REFERENCES SECTIONS (sectionNo, courseID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT FK_ROSTER_STUDENT FOREIGN KEY (studentID) REFERENCES STUDENT (studentID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ATTENDANCE(attendanceDate, sectionNo, courseID, studentID)
-- DESCRIPTION: Attendance list of students who scan QR code in a given section of a course.
--              Time that the qrCode is scanned is also recorded.
CREATE TABLE ATTENDANCE
(
    attendanceDate      TIMESTAMP,
    sectionNo           INTEGER,
    courseID            VARCHAR(20),
    studentID           INTEGER,

    CONSTRAINT PK_ATTENDANCE PRIMARY KEY (attendanceDate, sectionNo, courseID, studentID),
    CONSTRAINT FK_ATTENDANCE FOREIGN KEY (sectionNo, courseID, studentID) REFERENCES ROSTER (sectionNo, courseID, studentID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
