import type { Metadata } from 'next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import NextLink from 'next/link';
import Button from '@mui/material/Button';
import { Hero } from '@/components/ui/Hero';
import { ContentCard } from '@/components/ui/ContentCard';
import { getGlobal, getLatestBlogs, getLatestVideos } from '@/lib/strapi';
import type { Blog, Video } from '@/types';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobal();
  return {
    title: global?.siteName ?? '首页',
    description: global?.tagline ?? '',
  };
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '1.875rem' },
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Button
        component={NextLink}
        href={href}
        variant="text"
        sx={{ color: 'primary.main', fontWeight: 500, fontSize: '0.875rem' }}
      >
        查看全部 →
      </Button>
    </Box>
  );
}

// ─── Blog Cards ───────────────────────────────────────────────────────────────

function BlogSection({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) return null;
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }} aria-label="最新博客">
      <Container>
        <SectionHeader title="最新文章" href="/blog" />
        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item key={blog.id} xs={12} sm={6} md={4}>
              <ContentCard
                title={blog.title}
                href={`/blog/${blog.slug}`}
                publishedAt={blog.publishedAt ?? undefined}
                imageUrl={
                  blog.cover?.formats?.medium?.url ??
                  blog.cover?.url ??
                  undefined
                }
                imageAlt={blog.coverAlt ?? blog.cover?.alternativeText ?? blog.title}
                excerpt={blog.excerpt ?? undefined}
                category={blog.category?.name}
                tags={blog.tags.map((t) => ({ id: String(t.id), label: t.name }))}
                meta={blog.readingTime ? `${blog.readingTime} min read` : undefined}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Video Cards ──────────────────────────────────────────────────────────────

function VideoSection({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;
  return (
    <Box
      component="section"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}
      aria-label="最新视频"
    >
      <Container>
        <SectionHeader title="最新视频" href="/videos" />
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item key={video.id} xs={12} sm={6} md={4}>
              <ContentCard
                title={video.title}
                href={`/videos/${video.slug}`}
                publishedAt={video.publishedAt ?? undefined}
                imageUrl={
                  video.thumbnail?.formats?.medium?.url ??
                  video.thumbnail?.url ??
                  undefined
                }
                imageAlt={video.thumbnail?.alternativeText ?? video.title}
                excerpt={video.description ?? undefined}
                category={video.category?.name}
                tags={video.tags.map((t) => ({ id: String(t.id), label: t.name }))}
                meta={video.platform === 'bilibili' ? 'B站' : video.platform === 'youtube' ? 'YouTube' : video.platform}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  // Parallel fetch: global config + latest content
  const [global, blogs, videos] = await Promise.all([
    getGlobal(),
    getLatestBlogs(6),
    getLatestVideos(6),
  ]);

  return (
    <>
      {/* Hero */}
      <Hero
        name={global?.siteName}
        tagline={global?.tagline ?? undefined}
        avatarUrl={global?.avatar?.url}
        socialLinks={[
          ...(global?.githubUrl
            ? [{ label: 'GitHub', href: global.githubUrl, icon: <GithubIcon /> }]
            : []),
          ...(global?.bilibiliUrl
            ? [{ label: 'B站', href: global.bilibiliUrl, icon: <BilibiliIcon /> }]
            : []),
          ...(global?.twitterUrl
            ? [{ label: 'Twitter / X', href: global.twitterUrl, icon: <TwitterIcon /> }]
            : []),
          ...(global?.weiboUrl
            ? [{ label: '微博', href: global.weiboUrl, icon: <WeiboIcon /> }]
            : []),
        ]}
      />

      {/* Latest blogs */}
      <BlogSection blogs={blogs} />

      {/* Latest videos */}
      <VideoSection videos={videos} />
    </>
  );
}

// ─── Inline SVG icons (no extra dependency) ──────────────────────────────────

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function BilibiliIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WeiboIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10.098 20.323c-3.977.398-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.945-1.363 1.493-2.183 1.222-.817-.27-1.148-1.244-.766-2.18.38-.93 1.34-1.474 2.156-1.214.811.262 1.15 1.225.793 2.172zm2.895.362c-.129.444-.588.703-1.026.576-.435-.13-.672-.589-.544-1.032.127-.437.581-.7 1.017-.569.436.127.678.589.553 1.025zm1.378-5.687c-.42-.12-.708-.238-.49-.52.49-.631 1.354-.976 2.232-.8.882.181 1.486.882 1.352 1.65-.041.234-.189.453-.396.61-.338.254-.657.15-.908-.066-.232-.198-.496-.793-.79-.874zm6.52-1.96c-.573-1.657-2.09-2.825-3.786-2.938-.283-.019-.559-.007-.826.03-.266.035-.52.099-.758.187-.238.089-.46.208-.656.353-.2.148-.373.32-.516.51-.143.19-.254.4-.326.623-.074.224-.108.46-.096.697.009.239.055.472.135.69.082.218.198.416.348.586.15.17.33.313.53.419.2.106.42.174.643.2.225.025.453.006.674-.059.218-.065.421-.174.597-.32.178-.146.326-.328.435-.534.108-.205.177-.434.2-.667.058-.587-.177-1.166-.657-1.515-.247-.177-.548-.245-.835-.194-.13.024-.257.067-.373.13-.117.062-.22.14-.309.232-.086.09-.155.195-.203.308-.05.113-.077.234-.078.358-.002.126.02.25.066.368.047.116.112.22.196.307.083.087.181.158.289.21.107.05.221.08.336.09.116.009.233-.004.343-.036.108-.034.208-.087.297-.158.09-.072.164-.16.22-.26.055-.1.09-.209.102-.322.013-.114.003-.23-.028-.342-.033-.11-.085-.213-.154-.302a.79.79 0 0 0-.248-.207.784.784 0 0 0-.316-.088.746.746 0 0 0-.323.033.705.705 0 0 0-.29.16.662.662 0 0 0-.187.275.625.625 0 0 0-.04.329c.03.117.091.226.176.313a.568.568 0 0 0 .298.165c.112.028.23.027.341-.003.112-.03.213-.09.296-.17.083-.082.145-.183.18-.294.035-.112.04-.231.015-.347-.023-.117-.077-.226-.155-.314a.497.497 0 0 0-.26-.153.474.474 0 0 0-.3.015.447.447 0 0 0-.236.188.416.416 0 0 0-.065.285c.014.098.057.19.126.264.067.073.154.126.248.154.095.027.196.027.29-.002.094-.028.179-.08.248-.151.068-.071.116-.16.138-.255.022-.094.018-.192-.012-.284-.03-.09-.083-.172-.154-.237a.365.365 0 0 0-.23-.094.347.347 0 0 0-.237.065.325.325 0 0 0-.128.207.303.303 0 0 0 .04.237c.057.08.14.14.236.167.096.028.197.025.29-.008.094-.033.175-.093.235-.172z" />
    </svg>
  );
}
