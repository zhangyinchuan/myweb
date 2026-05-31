'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps, Theme } from '@mui/material/styles';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  siteName?: string;
  links?: NavLink[];
  actions?: React.ReactNode;
}

const defaultLinks: NavLink[] = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  { label: '视频', href: '/videos' },
  { label: '书籍', href: '/books' },
];

function HamburgerIcon({ open }: { open: boolean }) {
  const line: SxProps<Theme> = {
    display: 'block',
    width: 18,
    height: '1.5px',
    backgroundColor: 'text.primary',
    transformOrigin: 'center',
    transition: 'transform 250ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms',
  };
  return (
    <Box sx={{ width: 18, height: 12, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box component="span" sx={{ ...line, transform: open ? 'translateY(5.25px) rotate(45deg)' : 'none' }} />
      <Box component="span" sx={{ ...line, opacity: open ? 0 : 1 }} />
      <Box component="span" sx={{ ...line, transform: open ? 'translateY(-5.25px) rotate(-45deg)' : 'none' }} />
    </Box>
  );
}

export function Navbar({ siteName = '个人站点', links = defaultLinks, actions }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <AppBar
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container>
          <Toolbar
            disableGutters
            sx={{ height: { xs: 56, md: 60 }, minHeight: { xs: 56, md: 60 } }}
          >
            <Typography
              component={NextLink}
              href="/"
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
                color: 'text.primary',
                transition: 'opacity 150ms',
                '&:hover': { opacity: 0.6 },
              }}
              aria-label={`${siteName} - 返回首页`}
            >
              {siteName}
            </Typography>

            <Box
              component="nav"
              aria-label="主导航"
              sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mx: 'auto' }}
            >
              {links.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Box
                    key={link.href}
                    component={NextLink}
                    href={link.href}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1.5,
                      fontSize: '0.875rem',
                      fontWeight: active ? 500 : 400,
                      color: active ? 'text.primary' : 'text.secondary',
                      transition: 'color 150ms, background-color 150ms',
                      '&:hover': { color: 'text.primary', backgroundColor: 'action.hover' },
                    }}
                  >
                    {link.label}
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              {actions}
              <IconButton
                onClick={() => setDrawerOpen((v) => !v)}
                aria-label={drawerOpen ? '关闭菜单' : '打开菜单'}
                size="small"
                sx={{ display: { md: 'none' }, color: 'text.primary', p: 1 }}
              >
                <HamburgerIcon open={drawerOpen} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            top: 56,
            boxShadow: 'none',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& .MuiBackdrop-root': { backgroundColor: 'transparent' },
        }}
      >
        <List sx={{ py: 1 }}>
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={NextLink}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ px: 3, py: 1.25, color: active ? 'text.primary' : 'text.secondary' }}
                >
                  <ListItemText
                    primary={link.label}
                    slotProps={{ primary: { sx: { fontSize: '0.9375rem', fontWeight: active ? 500 : 400 } } }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
