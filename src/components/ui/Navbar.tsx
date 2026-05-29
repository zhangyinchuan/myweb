import NextLink from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  siteName?: string;
  links?: NavLink[];
  /** Rendered on the right — pass a ThemeToggle icon button */
  actions?: React.ReactNode;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, SxProps<Theme>> = {
  appBar: {
    position: 'sticky',
    top: 0,
    zIndex: (theme) => theme.zIndex.appBar,
  },
  toolbar: {
    height: { xs: 56, md: 64 },
    minHeight: { xs: 56, md: 64 },
    px: 0,
  },
  logo: {
    fontWeight: 700,
    fontSize: { xs: '1rem', md: '1.125rem' },
    letterSpacing: '-0.01em',
    color: 'text.primary',
    '&:hover': { color: 'primary.main' },
    transition: 'color 150ms',
  },
  navLinks: {
    display: { xs: 'none', md: 'flex' },
    gap: 0.5,
    mx: 'auto',
  },
  navButton: {
    color: 'text.secondary',
    fontWeight: 500,
    fontSize: '0.875rem',
    px: 1.5,
    py: 0.75,
    borderRadius: 1,
    '&:hover': {
      color: 'text.primary',
      backgroundColor: 'action.hover',
    },
    transition: 'color 150ms, background-color 150ms',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    ml: 'auto',
  },
};

// ─── Default Nav Links ────────────────────────────────────────────────────────

const defaultLinks: NavLink[] = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  { label: '视频', href: '/videos' },
  { label: '书籍', href: '/books' },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Navbar — 顶部导航栏
 *
 * 毛玻璃背景 + sticky，Apple 风格极简设计。
 * 移动端隐藏导航链接（后续可扩展汉堡菜单）。
 *
 * @example
 * <Navbar siteName="My Site" actions={<ThemeToggle />} />
 */
export function Navbar({ siteName = '个人站点', links = defaultLinks, actions }: NavbarProps) {
  return (
    <AppBar sx={styles.appBar} component="header">
      <Container>
        <Toolbar sx={styles.toolbar} disableGutters>
          {/* Logo */}
          <Typography
            component={NextLink}
            href="/"
            sx={styles.logo}
            aria-label={`${siteName} — 返回首页`}
          >
            {siteName}
          </Typography>

          {/* Nav Links (desktop) */}
          <Box component="nav" sx={styles.navLinks} aria-label="主导航">
            {links.map((link) => (
              <Button
                key={link.href}
                component={NextLink}
                href={link.href}
                sx={styles.navButton}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Right Actions */}
          {actions && <Box sx={styles.actions}>{actions}</Box>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
