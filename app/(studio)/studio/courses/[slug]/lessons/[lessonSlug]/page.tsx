'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Play,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LessonContent {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  durationMinutes: number | null;
  isCompleted: boolean;
  pointsReward: number | null;
}

interface LessonNav {
  slug: string;
  title: string;
}

interface LessonData {
  lesson: LessonContent;
  course: {
    id: number;
    title: string;
    slug: string;
  };
  previousLesson: LessonNav | null;
  nextLesson: LessonNav | null;
  allLessons: Array<{
    id: number;
    title: string;
    slug: string;
    isCompleted: boolean;
    durationMinutes: number | null;
  }>;
}

function VideoPlayer({ url }: { url: string }) {
  // Detect video type and render appropriate player
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    // Extract YouTube video ID
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }

    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Video"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (url.includes('vimeo.com')) {
    // Extract Vimeo video ID
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];

    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        title="Video"
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (url.includes('loom.com')) {
    // Extract Loom video ID
    const videoId = url.split('/share/')[1]?.split('?')[0];

    return (
      <iframe
        src={`https://www.loom.com/embed/${videoId}`}
        title="Video"
        className="w-full h-full"
        allowFullScreen
      />
    );
  }

  // Default: assume it's a direct video URL
  return (
    <video src={url} controls className="w-full h-full">
      Your browser does not support the video tag.
    </video>
  );
}

export default function LessonViewerPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug: courseSlug, lessonSlug } = use(params);
  const router = useRouter();
  const [isMarking, setIsMarking] = useState(false);
  const [showLessonList, setShowLessonList] = useState(false);

  const { data, isLoading, error } = useSWR<LessonData>(
    `/api/studio/courses/${courseSlug}/lessons/${lessonSlug}`,
    fetcher
  );

  // Update last accessed
  useEffect(() => {
    if (data?.course) {
      fetch(`/api/studio/courses/${courseSlug}/access`, { method: 'POST' });
    }
  }, [courseSlug, data?.course]);

  async function handleMarkComplete() {
    if (!data?.lesson) return;

    setIsMarking(true);
    try {
      const res = await fetch(
        `/api/studio/courses/${courseSlug}/lessons/${lessonSlug}/complete`,
        { method: 'POST' }
      );

      if (res.ok) {
        mutate(`/api/studio/courses/${courseSlug}/lessons/${lessonSlug}`);
        mutate(`/api/studio/courses/${courseSlug}`);
        mutate('/api/studio/stats');

        // Auto-navigate to next lesson if available
        if (data.nextLesson) {
          setTimeout(() => {
            router.push(
              `/studio/courses/${courseSlug}/lessons/${data.nextLesson!.slug}`
            );
          }, 500);
        }
      }
    } catch (error) {
      console.error('Failed to mark complete:', error);
    } finally {
      setIsMarking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="aspect-video bg-gray-200 rounded-lg" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Lesson not found
        </h2>
        <p className="text-gray-500 mb-4">
          This lesson doesn't exist or you don't have access.
        </p>
        <Button asChild>
          <Link href={`/studio/courses/${courseSlug}`}>Back to Course</Link>
        </Button>
      </div>
    );
  }

  const { lesson, course, previousLesson, nextLesson, allLessons } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/studio/courses/${course.slug}`}
          className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          {course.title}
        </Link>
      </div>

      {/* Video Player */}
      {lesson.videoUrl && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer url={lesson.videoUrl} />
        </div>
      )}

      {/* Lesson Info */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {lesson.isCompleted && (
              <span className="inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Completed
              </span>
            )}
            {lesson.durationMinutes && (
              <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {lesson.durationMinutes} min
              </span>
            )}
            {lesson.pointsReward && (
              <span className="text-sm text-[#CDA7B2]">
                +{lesson.pointsReward} points
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {lesson.title}
          </h1>
          {lesson.description && (
            <p className="text-gray-600 mt-2">{lesson.description}</p>
          )}
        </div>

        {!lesson.isCompleted && (
          <Button
            onClick={handleMarkComplete}
            disabled={isMarking}
            className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90 whitespace-nowrap"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isMarking ? 'Marking...' : 'Mark Complete'}
          </Button>
        )}
      </div>

      {/* Lesson Content */}
      {lesson.content && (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          </CardContent>
        </Card>
      )}

      {/* Lesson Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {previousLesson ? (
          <Link
            href={`/studio/courses/${courseSlug}/lessons/${previousLesson.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="text-left">
              <p className="text-xs text-gray-400">Previous</p>
              <p className="text-sm font-medium">{previousLesson.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/studio/courses/${courseSlug}/lessons/${nextLesson.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <div className="text-right">
              <p className="text-xs text-gray-400">Next</p>
              <p className="text-sm font-medium">{nextLesson.title}</p>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/studio/courses/${courseSlug}`}
            className="flex items-center gap-2 text-[#CDA7B2] hover:text-[#CDA7B2]/80"
          >
            <span className="text-sm font-medium">Back to Course</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Lesson List Toggle */}
      <Card className="bg-white border-0 shadow-sm">
        <button
          onClick={() => setShowLessonList(!showLessonList)}
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <span className="font-medium text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#CDA7B2]" />
            All Lessons ({allLessons.length})
          </span>
          {showLessonList ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {showLessonList && (
          <div className="border-t border-gray-100">
            {allLessons.map((l, index) => (
              <Link
                key={l.id}
                href={`/studio/courses/${courseSlug}/lessons/${l.slug}`}
                className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                  l.slug === lessonSlug ? 'bg-[#CDA7B2]/5' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {l.isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  ) : l.slug === lessonSlug ? (
                    <div className="w-6 h-6 rounded-full bg-[#CDA7B2] flex items-center justify-center">
                      <Play className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      l.slug === lessonSlug
                        ? 'text-[#CDA7B2]'
                        : l.isCompleted
                        ? 'text-gray-500'
                        : 'text-gray-900'
                    }`}
                  >
                    {l.title}
                  </p>
                </div>
                {l.durationMinutes && (
                  <span className="text-xs text-gray-400">
                    {l.durationMinutes} min
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
