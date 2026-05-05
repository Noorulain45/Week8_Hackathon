'use client';
import { Container, Box, Typography } from '@mui/material';
import PdfAnalyzer from '@/src/components/PdfAnalyzer';

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'transparent',
        fontFamily: '"Poppins", sans-serif',
        pb: { xs: 8, md: 16 },
      }}
    >
      {/* 🌸 NAVBAR */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(14px)',
          bgcolor: 'rgba(255,240,246,0.7)',
          borderBottom: '1px solid #f2cfe0',
          px: { xs: 2, md: 6 },
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
          ✨ Intellidoc
        </Typography>

        <Box
          sx={{
            px: 2,
            py: 0.6,
            borderRadius: '20px',
            background: 'linear-gradient(135deg,#f9a8d4,#c4b5fd)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          online ♡
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 12 } }}>

        {/* 🌷 HERO */}
        <Box sx={{ mb: { xs: 8, md: 14 } }}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '5rem' },
              lineHeight: 1,
              letterSpacing: '-0.04em',
              mb: 4,
            }}
          >
            Your cozy AI<br />
            for <span className="gradient-text">PDF magic ✨</span>
          </Typography>

          <Typography
            sx={{
              fontSize: 16,
              color: '#7a6a75',
              maxWidth: 420,
              mb: 5,
            }}
          >
            Upload your PDFs and get soft, smart, grounded answers —
            no stress, no chaos, just clarity 💗
          </Typography>

          {/* stats */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { value: '<30s', label: 'response' },
              { value: '100%', label: 'grounded' },
            ].map((s) => (
              <Box
                key={s.label}
                className="glass-card"
                sx={{ px: 3, py: 2 }}
              >
                <Typography sx={{ fontWeight: 900 }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#9c8c96' }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 💌 ANALYZER */}
        <PdfAnalyzer />

        {/* 🌸 FEATURES */}
        <Box
          sx={{
            mt: 10,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' },
            gap: 3,
          }}
        >
          {[
            { title: 'Smart routing', body: 'Your question goes to the perfect AI agent instantly.' },
            { title: 'Deep extraction', body: 'We read your PDF like a human (but faster).' },
            { title: 'No hallucinations', body: 'Everything is grounded in your file.' },
          ].map((f) => (
            <Box key={f.title} className="glass-card" sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                {f.title}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#7a6a75' }}>
                {f.body}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}