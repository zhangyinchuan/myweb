import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface HeroProps {
  name?: string;
  tagline?: string;
  avatarUrl?: string;
  socialLinks?: SocialLink[];
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, SxProps<Theme>> = {
  section: {
    minHeight: { xs: '60vh', md: '80vh' },
    display: 'flex',
    alignItems: 'center',
    py: { xs: 10, md: 16 },
  },
  inner: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row-reverse' },
    alignItems: 'center',
    gap: { xs: 6, md: 10 },
    width: '100%',
  },
  avatarWrapper: {
    flexShrink: 0,
  },
  avatar: {
    width: { xs: 120, md: 160 },
    height: { xs: 120, md: 160 },
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: 'action.hover',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  },
  avatarPlaceholder: {
    width: { xs: 120, md: 160 },
    height: { xs: 120, md: 160 },
    borderRadius: '50%',
    backgroundColor: 'action.hover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    maxWidth: 600,
  },
  name: {
    fontWeight: 700,
    fontSize: { xs: '2.5rem', md: '3.75rem' },
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    color: 'text.primary',
    mb: 2,
  },
  tagline: {
    fontSize: { xs: '1.125rem', md: '1.375rem' },
    color: 'text.secondary',
    lineHeight: 1.6,
    mb: 4,
    maxWidth: 480,
  },
  socialRow: {
    display: 'flex',
    gap: 0.5,
    flexWrap: 'wrap',
  },
  socialButton: {
    color: 'text.secondary',
    p: 1,
    borderRadius: 1.5,
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      color: 'text.primary',
      borderColor: 'text.secondary',
      backgroundColor: 'action.hover',
    },
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Hero — 首页 Hero 区
 *
 * 展示站长头像、名字、一句话简介、社交链接。
 * 移动端竖排，桌面端图片在右、文字在左。
 *
 * @example
 * <Hero
 *   name="张三"
 *   tagline="记录思考，分享所得。热爱技术与阅读。"
 *   avatarUrl="https://cdn.example.com/avatar.jpg"
 *   socialLinks={[{ label: 'GitHub', href: '...', icon: <GitHubIcon /> }]}
 * />
 */
export function Hero({ name, tagline, avatarUrl, socialLinks = [] }: HeroProps) {
  return (
    <Box component="section" sx={styles.section} aria-label="个人简介">
      <Container>
        <Box sx={styles.inner}>
          {/* Avatar */}
          <Box sx={styles.avatarWrapper}>
            {avatarUrl ? (
              <Box
                component="img"
                src={avatarUrl}
                alt={name ? `${name} 的头像` : '站长头像'}
                sx={styles.avatar}
              />
            ) : (
              <Box sx={styles.avatarPlaceholder} aria-hidden />
            )}
          </Box>

          {/* Text content */}
          <Box sx={styles.content}>
            {name && (
              <Typography component="h1" sx={styles.name}>
                {name}
              </Typography>
            )}

            {tagline && (
              <Typography sx={styles.tagline}>{tagline}</Typography>
            )}

            {socialLinks.length > 0 && (
              <Box sx={styles.socialRow} aria-label="社交媒体">
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.href}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={styles.socialButton}
                    size="small"
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
