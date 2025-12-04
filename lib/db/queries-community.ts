import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { db } from './drizzle';
import {
  communityPosts,
  postComments,
  postLikes,
  CommunityPost,
  NewCommunityPost,
  PostComment,
  NewPostComment,
} from './schema';
import { awardPoints } from './queries-progress';

// =============================================
// COMMUNITY POST QUERIES
// =============================================

export async function getAllPosts(
  limit = 20,
  offset = 0,
  postType?: string,
  courseId?: number
) {
  let query = db.query.communityPosts.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
      course: {
        columns: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: [desc(communityPosts.isPinned), desc(communityPosts.createdAt)],
    limit,
    offset,
  });

  return query;
}

export async function getPostsByType(postType: string, limit = 20, offset = 0) {
  return await db.query.communityPosts.findMany({
    where: eq(communityPosts.postType, postType),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [desc(communityPosts.isPinned), desc(communityPosts.createdAt)],
    limit,
    offset,
  });
}

export async function getPostsByCourse(courseId: number, limit = 20, offset = 0) {
  return await db.query.communityPosts.findMany({
    where: eq(communityPosts.courseId, courseId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [desc(communityPosts.isPinned), desc(communityPosts.createdAt)],
    limit,
    offset,
  });
}

export async function getPostById(id: number) {
  const post = await db.query.communityPosts.findFirst({
    where: eq(communityPosts.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
      course: {
        columns: {
          id: true,
          title: true,
          slug: true,
        },
      },
      comments: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
          replies: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [asc(postComments.createdAt)],
      },
      likes: true,
    },
  });

  return post || null;
}

export async function getUserPosts(userId: number, limit = 20) {
  return await db.query.communityPosts.findMany({
    where: eq(communityPosts.userId, userId),
    with: {
      course: {
        columns: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: [desc(communityPosts.createdAt)],
    limit,
  });
}

export async function createPost(data: NewCommunityPost): Promise<CommunityPost> {
  const [post] = await db.insert(communityPosts).values(data).returning();

  // Award points for creating a post
  await awardPoints(data.userId, 10, 'post_created', 'post', post.id);

  return post;
}

export async function updatePost(
  id: number,
  userId: number,
  data: Partial<Pick<NewCommunityPost, 'title' | 'content' | 'postType'>>
): Promise<CommunityPost | null> {
  const [updated] = await db
    .update(communityPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(communityPosts.id, id), eq(communityPosts.userId, userId)))
    .returning();

  return updated || null;
}

export async function deletePost(id: number, userId: number): Promise<boolean> {
  const result = await db
    .delete(communityPosts)
    .where(and(eq(communityPosts.id, id), eq(communityPosts.userId, userId)))
    .returning();

  return result.length > 0;
}

export async function pinPost(id: number, isPinned: boolean): Promise<CommunityPost | null> {
  const [updated] = await db
    .update(communityPosts)
    .set({ isPinned, updatedAt: new Date() })
    .where(eq(communityPosts.id, id))
    .returning();

  return updated || null;
}

// =============================================
// COMMENT QUERIES
// =============================================

export async function getPostComments(postId: number) {
  return await db.query.postComments.findMany({
    where: and(
      eq(postComments.postId, postId),
      sql`${postComments.parentId} IS NULL`
    ),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
      replies: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [asc(postComments.createdAt)],
      },
    },
    orderBy: [asc(postComments.createdAt)],
  });
}

export async function createComment(data: NewPostComment): Promise<PostComment> {
  const [comment] = await db.insert(postComments).values(data).returning();

  // Update post comment count
  await db
    .update(communityPosts)
    .set({
      commentsCount: sql`${communityPosts.commentsCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(communityPosts.id, data.postId));

  // Award points for commenting
  await awardPoints(data.userId, 5, 'comment_created', 'comment', comment.id);

  return comment;
}

export async function updateComment(
  id: number,
  userId: number,
  content: string
): Promise<PostComment | null> {
  const [updated] = await db
    .update(postComments)
    .set({ content, updatedAt: new Date() })
    .where(and(eq(postComments.id, id), eq(postComments.userId, userId)))
    .returning();

  return updated || null;
}

export async function deleteComment(id: number, userId: number): Promise<boolean> {
  // Get the comment first to find the post
  const [comment] = await db
    .select()
    .from(postComments)
    .where(and(eq(postComments.id, id), eq(postComments.userId, userId)))
    .limit(1);

  if (!comment) return false;

  const result = await db
    .delete(postComments)
    .where(eq(postComments.id, id))
    .returning();

  if (result.length > 0) {
    // Update post comment count
    await db
      .update(communityPosts)
      .set({
        commentsCount: sql`GREATEST(${communityPosts.commentsCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(communityPosts.id, comment.postId));

    return true;
  }

  return false;
}

// =============================================
// LIKE QUERIES
// =============================================

export async function likePost(userId: number, postId: number): Promise<boolean> {
  try {
    await db.insert(postLikes).values({ userId, postId });

    // Update post like count
    await db
      .update(communityPosts)
      .set({
        likesCount: sql`${communityPosts.likesCount} + 1`,
      })
      .where(eq(communityPosts.id, postId));

    return true;
  } catch {
    // Already liked (unique constraint violation)
    return false;
  }
}

export async function unlikePost(userId: number, postId: number): Promise<boolean> {
  const result = await db
    .delete(postLikes)
    .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)))
    .returning();

  if (result.length > 0) {
    // Update post like count
    await db
      .update(communityPosts)
      .set({
        likesCount: sql`GREATEST(${communityPosts.likesCount} - 1, 0)`,
      })
      .where(eq(communityPosts.id, postId));

    return true;
  }

  return false;
}

export async function isPostLikedByUser(
  userId: number,
  postId: number
): Promise<boolean> {
  const [like] = await db
    .select()
    .from(postLikes)
    .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)))
    .limit(1);

  return like !== null;
}

export async function getPostLikers(postId: number) {
  return await db.query.postLikes.findMany({
    where: eq(postLikes.postId, postId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

// =============================================
// COMMUNITY STATS
// =============================================

export async function getCommunityStats() {
  const [postsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(communityPosts);

  const [commentsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postComments);

  return {
    totalPosts: postsResult?.count || 0,
    totalComments: commentsResult?.count || 0,
  };
}

export async function getUserCommunityStats(userId: number) {
  const [postsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(communityPosts)
    .where(eq(communityPosts.userId, userId));

  const [commentsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postComments)
    .where(eq(postComments.userId, userId));

  const [likesResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postLikes)
    .innerJoin(communityPosts, eq(postLikes.postId, communityPosts.id))
    .where(eq(communityPosts.userId, userId));

  return {
    postsCreated: postsResult?.count || 0,
    commentsCreated: commentsResult?.count || 0,
    likesReceived: likesResult?.count || 0,
  };
}
