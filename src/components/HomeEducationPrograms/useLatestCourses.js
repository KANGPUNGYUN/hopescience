import { useEffect, useState } from "react";
import { getApi } from "../../api";
import { HOME_EDUCATION_FALLBACK_COURSES } from "./homeEducationConfig";

const LECTURE_GROUP_ID = 1;

const mapListItem = (service) => ({
  id: service.id,
  title: service.title,
  thumbnail: service.thumbnail_image,
  created_at: service.created_at,
  is_active: service.is_active,
});

const mapDetail = (course, base) => ({
  ...base,
  description: course.summary || course.description || "",
  videoUrl: course.sections?.[0]?.lectures?.[0]?.video_url || null,
});

export const getVimeoEmbedUrl = (videoUrl) => {
  if (!videoUrl) return null;
  const id = videoUrl.split("/").pop()?.split("?")[0];
  if (!id) return null;
  return `https://player.vimeo.com/video/${id}?background=1&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0`;
};

export const useLatestCourses = (limit = 3) => {
  const [courses, setCourses] = useState(HOME_EDUCATION_FALLBACK_COURSES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const list = await getApi({ path: `/courses/group/${LECTURE_GROUP_ID}` });
        if (!Array.isArray(list) || cancelled) {
          setLoading(false);
          return;
        }

        const latest = list
          .filter((item) => item.is_active)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, limit)
          .map(mapListItem);

        if (latest.length === 0) {
          setLoading(false);
          return;
        }

        const detailed = await Promise.all(
          latest.map(async (item) => {
            try {
              const detail = await getApi({ path: `/courses/${item.id}` });
              return mapDetail(detail, item);
            } catch {
              return { ...item, description: "", videoUrl: null };
            }
          })
        );

        if (!cancelled) {
          setCourses(
            detailed.map((course, index) => ({
              ...course,
              thumbnail:
                course.thumbnail ||
                HOME_EDUCATION_FALLBACK_COURSES[index]?.thumbnail,
            }))
          );
        }
      } catch {
        if (!cancelled) {
          setCourses(HOME_EDUCATION_FALLBACK_COURSES);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { courses, loading };
};
