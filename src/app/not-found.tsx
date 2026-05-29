import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '页面未找到',
};

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
          py: 12,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '5rem', md: '8rem' },
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'text.primary',
            opacity: 0.15,
          }}
        >
          404
        </Typography>

        <Typography
          component="h1"
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          页面未找到
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 360 }}>
          你访问的页面不存在，或已被移除。
        </Typography>

        <Button
          component={NextLink}
          href="/"
          variant="contained"
          sx={{ mt: 1 }}
        >
          返回首页
        </Button>
      </Box>
    </Container>
  );
}
