import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

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

export function Hero({ name, tagline, avatarUrl, socialLinks = [] }: HeroProps) {
  return (
    <Box
      component="section"
      aria-label="个人简介"
      sx={{
        minHeight: { xs: 'auto', md: '72vh' },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 12, md: 0 },
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row-reverse' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 8, md: 12 },
          }}
        >
          {/* Avatar — double-bezel */}
          <Box sx={{ flexShrink: 0, alignSelf: { xs: 'center', md: 'flex-start' }, mt: { md: 1 } }}>
            <Box
              sx={{
                p: '5px',
                borderRadius: '50%',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'action.hover',
              }}
            >
              {avatarUrl ? (
                <Box
                  component="img"
                  src={avatarUrl}
                  alt={name ? `${name} 的头像` : '站长头像'}
                  sx={{
                    width: { xs: 100, md: 140 },
                    height: { xs: 100, md: 140 },
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
                  }}
                />
              ) : (
                <Box
                  aria-hidden
                  sx={{
                    width: { xs: 100, md: 140 },
                    height: { xs: 100, md: 140 },
                    borderRadius: '50%',
                    backgroundColor: 'action.selected',
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Text */}
          <Box sx={{ flex: 1, maxWidth: 560 }}>
            {name && (
              <Typography
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.25rem', md: '3.5rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                  mb: 2.5,
                }}
              >
                {name}
              </Typography>
            )}

            {tagline && (
              <Typography
                sx={{
                  fontSize: { xs: '1.0625rem', md: '1.25rem' },
                  color: 'text.secondary',
                  lineHeight: 1.65,
                  mb: socialLinks.length > 0 ? 5 : 0,
                  maxWidth: 440,
                }}
              >
                {tagline}
              </Typography>
            )}

            {socialLinks.length > 0 && (
              <Box aria-label="社交媒体" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.href}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      p: '7px',
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'color 150ms, border-color 150ms, background-color 150ms',
                      '&:hover': {
                        color: 'text.primary',
                        borderColor: 'text.secondary',
                        backgroundColor: 'action.hover',
                      },
                      '&:active': { transform: 'scale(0.97)' },
                    }}
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
