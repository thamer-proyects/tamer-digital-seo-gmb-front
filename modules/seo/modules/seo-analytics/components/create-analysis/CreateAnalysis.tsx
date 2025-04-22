import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAnalysis } from '../../hooks/useAnalysis';
import RootInput from '@/components/ui/root-input';
import { Button } from '@heroui/react';
import { Search, Zap } from 'lucide-react';
import { AnalysisFormData } from '../../schema/analysisSchema';

export function CreateAnalysis() {
  // Hook personalizado para crear análisis y manejar errores de servidor
  const { error: serverError, createBasicAnalysis } = useAnalysis();

  // React Hook Form: validación solo al submit
  const methods = useForm<AnalysisFormData>({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
  const { handleSubmit } = methods;

  // Callbacks para manejo de submit y errores
  const onValid = (data: AnalysisFormData) => {
    console.log('Form data:', data);
    createBasicAnalysis(data);
  };

  const onError = (errors: any) => {
    console.log('Validation errors:', errors);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={handleSubmit(onValid, onError)}
          className="w-full max-w-2xl p-4"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                Optimize Your Website&apos;s Performance
              </span>
            </h1>
            <p className="text-gray-400">
              Get comprehensive SEO analysis and performance metrics to boost your website&apos;s
              visibility and speed. On-page, off-page, and technical SEO insights in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <RootInput
                name="url"
                label="URL"
                placeholder="Enter URL to analyze"
                isUrl
                required
                startContent={<Search className="text-gray-400 w-5 h-5" />}
              />
              {serverError && (
                <p className="absolute text-red-500 text-sm mt-1">{serverError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
            >
              Analyze Now <Zap className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              On-Page SEO Analysis
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              Performance Metrics
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Technical SEO Insights
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

