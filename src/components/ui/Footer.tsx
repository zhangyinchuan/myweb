import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  siteName?: string;
  footerText?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, SxProps<Theme>> = {
  footer: {
    py: { xs: 6, md: 8 },
    mt: 'auto',
    borderTop: '1px solid',
    borderColor: 'divider',
  },
  inner: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', md: 'center' },
    gap: 4,
  },
  brand: {
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '-0.02em',
    color: 'text.primary',
    mb: 0.5,
  },
  footerText: {
    fontSize: '0.75rem',
    color: 'text.secondary',
    maxWidth: 300,
  },
  navLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: { xs: 1.5, md: 2 },
  },
  navLink: {
    fontSize: '0.875rem',
    color: 'text.secondary',
    '&:hover': { color: 'text.primary' },
    transition: 'color 150ms',
  },
  socialLinks: {
    display: 'flex',
    gap: 0.5,
  },
  socialButton: {
    color: 'text.secondary',
    '&:hover': { color: 'text.primary' },
    transition: 'color 150ms',
    p: 0.75,
  },
  copyright: {
    mt: 6,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: 1,
  },
  copyrightText: {
    fontSize: '0.75rem',
    color: 'text.secondary',
  },
};

const defaultNavLinks: FooterLink[] = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  { label: '视频', href: '/videos' },
  { label: '书籍', href: '/books' },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Footer — 页脚
 *
 * 包含品牌名、导航链接、社交媒体图标、版权信息。
 *
 * @example
 * <Footer siteName="My Site" footerText="分享知识与思考" socialLinks={[...]} />
 */
export function Footer({
  siteName = '个人站点',
  footerText,
  socialLinks = [],
  navLinks = defaultNavLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={styles.footer}>
      <Container>
        <Box sx={styles.inner}>
          {/* Brand + tagline */}
          <Box>
            <Typography sx={styles.brand}>{siteName}</Typography>
            {footerText && (
              <Typography sx={styles.footerText}>{footerText}</Typography>
            )}
          </Box>

          {/* Nav links */}
          <Box component="nav" sx={styles.navLinks} aria-label="页脚导航">
            {navLinks.map((link) => (
              <Typography
                key={link.href}
                component={NextLink}
                href={link.href}
                sx={styles.navLink}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <Box sx={styles.socialLinks} aria-label="社交媒体链接">
              {socialLinks.map((social) => (
                <IconButton
                  key={social.href}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  size="small"
                  sx={styles.socialButton}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          )}
        </Box>

        {/* Copyright bar */}
        <Box sx={styles.copyright}>
          <Typography sx={styles.copyrightText}>
            © {currentYear} {siteName}. All rights reserved.
          </Typography>
          <Typography sx={styles.copyrightText}>
            Built with Next.js & Strapi
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
