'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography,
  CircularProgress, Divider
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAnalyzePdfMutation } from '@/src/store/apiSlice';

export default function PdfAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const [analyzePdf, { isLoading, data, reset }] = useAnalyzePdfMutation();

  useEffect(() => {
    if (data) {
      setMessage('');
      toast.success('✨ Your report is ready!');
    }
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const selectedFile = e.target.files[0];

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File too big (max 10MB)');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    reset();

    toast.success('PDF uploaded 💗');
  };

  const handleRunAnalysis = async () => {
    if (!message.trim()) return toast.error("Type something ✨");
    if (!file) return toast.error("Upload a PDF 💌");

    try {
      const result: any = await analyzePdf({ file, message }).unwrap();

      if (result.success === false) {
        toast.error(result.error);
        return;
      }

      toast.success("Analysis complete ✨");

    } catch {
      toast.error("Something went wrong 💔");
    }
    
  };

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleRunAnalysis(); // call your analysis function
  }
};


  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '320px 1fr' },
        gap: 2,
      }}
    >
      <Toaster position="top-right" />

      {/* LEFT */}
      <Box className="glass-card" sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Upload PDF 💌
        </Typography>

        <input hidden id="pdf-upload" type="file" onChange={handleFileChange} />

        <label htmlFor="pdf-upload">
          <Box
            sx={{
              border: '2px dashed #f4a7c5',
              borderRadius: '16px',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: '#f4a7c5' }} />
            <Typography>{file ? file.name : "Drop your file"}</Typography>
          </Box>
        </label>

        {previewUrl && (
          <Box sx={{ mt: 3, height: 200 }}>
            <iframe src={previewUrl} width="100%" height="100%" />
          </Box>
        )}
      </Box>

      {/* RIGHT */}
      <Box className="glass-card" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
       <TextField
  fullWidth
  variant="standard"
  placeholder="Ask about your PDF..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={handleKeyDown}
  slotProps={{
    input: {
      disableUnderline: true,   // ✅ works here
      sx: {
        fontFamily: '"Poppins", sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--foreground)',
        '&::placeholder': { color: '#d8a6c8' },
      },
    },
  }}
/>




          <Button
            onClick={handleRunAnalysis}
            disabled={!file || !message || isLoading}
            sx={{
              borderRadius: '14px',
              background: 'linear-gradient(135deg,#f9a8d4,#c4b5fd)',
              color: '#fff',
            }}
          >
            {isLoading ? <CircularProgress size={18} /> : <SendIcon />}
          </Button>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          {isLoading ? (
            <CircularProgress />
          ) : !data ? (
            <Typography sx={{ opacity: 0.5 }}>
              ✨ Your results will appear here
            </Typography>
          ) : (
            <>
              <Typography sx={{ fontWeight: 800, mb: 2 }}>
                ✨ Intelligence Report
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {data.data}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}