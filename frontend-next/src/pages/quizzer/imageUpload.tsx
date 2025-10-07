import React from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { DropZoneArea } from '@/components/ui-forms/quizzer/imageUpload/dropzonearea/DropZoneArea';

export default function ImageUploadPage() {
  const contents = () => {
    return (
      <Container>
        <DropZoneArea />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'画像アップロード'} />;
}
