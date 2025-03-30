'use client';
import { CreateAnalysis } from '@/modules/seo/modules/seo-analytics/components/create-analysis/CreateAnalysis';
import { AnalysisFormData } from '@/modules/seo/modules/seo-analytics/schema/analysisSchema';
import { FormProvider, useForm } from 'react-hook-form';

const CreateAnalysisPage = () => {
  const methods = useForm<AnalysisFormData>();
  return (
    <FormProvider {...methods}>
      <CreateAnalysis />;
    </FormProvider>
  );
};

export default CreateAnalysisPage;
