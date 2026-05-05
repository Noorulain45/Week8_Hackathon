import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface AnalyzeResponse {
  success: boolean;
  data: string;
  steps: {
    agent: string;
    type: string;
  }[];
  fileName: string;
}

export const pdfApi = createApi({
  reducerPath: 'pdfApi',
  // Backend is on 3000, Frontend on 3001
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }), 
  endpoints: (builder) => ({
    // Keep the object type here so your component can pass { file, message }
    analyzePdf: builder.mutation<AnalyzeResponse, { file: File; message: string }>({
      query: ({ file, message }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message', message);

        return {
          url: '/ai/analyze', 
          method: 'POST',
          body: formData,
          // DO NOT set headers here. 
          // fetchBaseQuery will automatically detect FormData and 
          // let the browser set the multipart/form-data boundary.
        };
      },
    }),
  }),
});

export const { useAnalyzePdfMutation } = pdfApi;