import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { seoSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/seo/[page] - Get SEO settings for a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;

    const [settings] = await db
      .select()
      .from(seoSettings)
      .where(eq(seoSettings.page, page))
      .limit(1);

    if (!settings) {
      // Return default SEO settings if none exist
      return NextResponse.json({
        seo: {
          page,
          title: 'Patrick Farrell | Tech Strategy & Business Growth',
          description: 'Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches.',
          keywords: 'tech strategy, business growth, startups, entrepreneurs, coaches',
          ogTitle: null,
          ogDescription: null,
          ogImageUrl: null,
          ogType: 'website',
          twitterCard: 'summary_large_image',
          twitterTitle: null,
          twitterDescription: null,
          twitterImageUrl: null,
          canonicalUrl: null,
          metaRobots: 'index, follow',
        }
      });
    }

    return NextResponse.json({ seo: settings });
  } catch (error: any) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch SEO settings' },
      { status: 500 }
    );
  }
}

// PUT /api/seo/[page] - Update SEO settings for a specific page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const currentUser = await getUser();

    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update SEO settings
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { page } = await params;
    const body = await request.json();

    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImageUrl,
      ogType,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImageUrl,
      canonicalUrl,
      metaRobots,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Check if settings already exist for this page
    const [existingSettings] = await db
      .select()
      .from(seoSettings)
      .where(eq(seoSettings.page, page))
      .limit(1);

    let updatedSettings;

    if (existingSettings) {
      // Update existing settings
      [updatedSettings] = await db
        .update(seoSettings)
        .set({
          title,
          description,
          keywords: keywords || null,
          ogTitle: ogTitle || null,
          ogDescription: ogDescription || null,
          ogImageUrl: ogImageUrl || null,
          ogType: ogType || 'website',
          twitterCard: twitterCard || 'summary_large_image',
          twitterTitle: twitterTitle || null,
          twitterDescription: twitterDescription || null,
          twitterImageUrl: twitterImageUrl || null,
          canonicalUrl: canonicalUrl || null,
          metaRobots: metaRobots || 'index, follow',
          updatedBy: currentUser.id,
          updatedAt: new Date(),
        })
        .where(eq(seoSettings.id, existingSettings.id))
        .returning();
    } else {
      // Create new settings
      [updatedSettings] = await db
        .insert(seoSettings)
        .values({
          page,
          title,
          description,
          keywords: keywords || null,
          ogTitle: ogTitle || null,
          ogDescription: ogDescription || null,
          ogImageUrl: ogImageUrl || null,
          ogType: ogType || 'website',
          twitterCard: twitterCard || 'summary_large_image',
          twitterTitle: twitterTitle || null,
          twitterDescription: twitterDescription || null,
          twitterImageUrl: twitterImageUrl || null,
          canonicalUrl: canonicalUrl || null,
          metaRobots: metaRobots || 'index, follow',
          updatedBy: currentUser.id,
        })
        .returning();
    }

    return NextResponse.json({
      message: 'SEO settings updated successfully',
      seo: updatedSettings,
    });
  } catch (error: any) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update SEO settings' },
      { status: 500 }
    );
  }
}
