import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { Header, Footer } from "../../components";
import { service } from "../../store";
import { CoursesHero } from "./CoursesHero";
import { CoursesFilter } from "./CoursesFilter";
import { CoursesListCard } from "./CoursesListCard";
import { CoursesListCardSkeleton } from "./CoursesListCardSkeleton";
import { matchesCourseFilter } from "./coursesConfig";

const SKELETON_COUNT = 6;

export const Courses = () => {
  const getServicesbyGroup = service((state) => state.getServicesbyGroup);
  const isLoading = service((state) => state.isLoading);
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchServices = async () => {
      const [lectureServices, normalServices] = await Promise.all([
        getServicesbyGroup(1),
        getServicesbyGroup(2),
      ]);

      const merged = [
        ...(Array.isArray(lectureServices) ? lectureServices : []),
        ...(Array.isArray(normalServices) ? normalServices : []),
      ];

      const uniqueById = merged.filter(
        (course, index, list) =>
          course.is_active === true &&
          list.findIndex((item) => item.id === course.id) === index
      );

      setCourses(uniqueById);
    };

    fetchServices();
  }, [getServicesbyGroup]);

  const filteredCourses = useMemo(
    () => courses.filter((course) => matchesCourseFilter(course, activeFilter)),
    [courses, activeFilter]
  );

  return (
    <>
      <div className="courses-page-shell">
        <Header variant="dark" />
        <main className="courses-page">
          <CoursesHero />
          <section className="courses-page__content" aria-label="교육 과정 목록">
            <div className="courses-page__inner">
              <CoursesFilter
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              <div
                className={`courses-page__grid${
                  isLoading ? " courses-page__grid--loading" : ""
                }`}
              >
                {isLoading ? (
                  Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                    <CoursesListCardSkeleton key={index} />
                  ))
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <CoursesListCard key={course.id} course={course} />
                  ))
                ) : (
                  <p className="courses-page__empty" role="status">
                    해당 카테고리에 등록된 교육 과정이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};
