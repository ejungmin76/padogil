import CourseCard from "./CourseCard";
import type { Course } from "@/types/course";

type CourseListProps = {
  courses: Course[];
};

export default function CourseList({
  courses,
}: CourseListProps) {
  return (
    <section className="courseList">
      {courses.map((course, index) => (
        <CourseCard
          key={course.id}
          course={course}
          index={index}
        />
      ))}

      <style jsx>{`
        .courseList {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        @media (max-width: 1180px) {
          .courseList {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .courseList {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}