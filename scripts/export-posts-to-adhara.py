#!/usr/bin/env python3
"""
Export published blog posts from the oceoluxe PostgreSQL database to a JSON file
that can be seeded into Adhara CMS.

Usage:
    python3 scripts/export-posts-to-adhara.py

    Then seed into Adhara:
    ADHARA_PROFILE=lana-victoria python3 -m commands.seed_blog \
      --file posts-export.json \
      --author "Kerri Bridgman" \
      --dir .

Requirements:
    pip install psycopg2-binary markdown python-dotenv

Environment:
    POSTGRES_URL must be set (or .env must exist with POSTGRES_URL)
"""

import json
import os
import sys
from pathlib import Path

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
    load_dotenv(Path(__file__).parent.parent / ".env.local", override=True)
except ImportError:
    pass

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("Error: psycopg2 not installed. Run: pip install psycopg2-binary", file=sys.stderr)
    sys.exit(1)

try:
    import markdown as md_lib
    HAS_MARKDOWN = True
except ImportError:
    HAS_MARKDOWN = False
    print("Warning: markdown library not installed. Content will be stored as-is.")
    print("For proper HTML conversion: pip install markdown")


POSTGRES_URL = os.environ.get("POSTGRES_URL")
if not POSTGRES_URL:
    print("Error: POSTGRES_URL environment variable not set.", file=sys.stderr)
    sys.exit(1)


def markdown_to_html(text: str) -> str:
    """Convert markdown to HTML. Falls back to wrapping in <p> tags if library missing."""
    if not text:
        return ""
    if HAS_MARKDOWN:
        return md_lib.markdown(
            text,
            extensions=["tables", "fenced_code", "nl2br", "sane_lists"],
        )
    # Fallback: wrap paragraphs
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    return "\n".join(f"<p>{p}</p>" for p in paragraphs)


def export_posts():
    conn = psycopg2.connect(POSTGRES_URL)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cursor.execute("""
        SELECT
            id,
            title,
            slug,
            author,
            excerpt,
            content,
            cover_image_url,
            og_image_url,
            meta_title,
            meta_description,
            meta_keywords,
            published_at,
            reading_time_minutes,
            industry
        FROM blog_posts
        WHERE is_published = true
        ORDER BY published_at DESC
    """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    posts = []
    for row in rows:
        content_html = markdown_to_html(row["content"] or "")
        excerpt = row["excerpt"] or ""

        post = {
            "slug": row["slug"],
            "title": row["title"],
            "excerpt": excerpt,
            "content": content_html,   # HTML — Adhara seed_blog uses this directly
            "image": row["cover_image_url"] or row["og_image_url"] or "",
            "meta_title": row["meta_title"] or row["title"],
            "meta_description": row["meta_description"] or excerpt,
            "tags": [row["industry"]] if row["industry"] else [],
            "published_at": row["published_at"].isoformat() if row["published_at"] else None,
            "reading_time_minutes": row["reading_time_minutes"],
        }
        posts.append(post)

    output_path = Path(__file__).parent.parent / "posts-export.json"
    output_path.write_text(json.dumps(posts, indent=2, ensure_ascii=False, default=str))

    print(f"Exported {len(posts)} posts → {output_path}")
    print()
    print("Next step — seed into Adhara:")
    print(f"  cd {Path(__file__).parent.parent}")
    print(f"  ADHARA_PROFILE=lana-victoria python3 -m commands.seed_blog \\")
    print(f"    --file posts-export.json \\")
    print(f"    --author 'Kerri Bridgman'")
    print()
    print("Or using the adhara-integrate CLI (from the AdharaWebIntegrate skill):")
    print(f"  adhara-integrate seed-blog --file posts-export.json --author 'Kerri Bridgman'")


if __name__ == "__main__":
    export_posts()
