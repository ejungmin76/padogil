type CourseDetailPageProps = {
  params: {
    courseId: string;
  };
};

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <main>
      <h1>Course Detail Page</h1>
      <p>{params.courseId}</p>
    </main>
  );
}