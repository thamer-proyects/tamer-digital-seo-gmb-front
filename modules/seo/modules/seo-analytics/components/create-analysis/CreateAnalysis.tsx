import { useFormContext } from 'react-hook-form';
import { useAnalysis } from '../../hooks/useAnalysis';
import { Button } from '@heroui/react';
import { AnalysisFormData } from '../../schema/analysisSchema';
import { Search, Zap } from 'lucide-react';
import RootInput from '@/components/ui/root-input';

export function CreateAnalysis() {
  const { error, createBasicAnalysis } = useAnalysis();
  const { handleSubmit } = useFormContext<AnalysisFormData>();

  return (
    <div className="min-h-screen items-center  ">
      <form onSubmit={handleSubmit(createBasicAnalysis)}>
        <div className="min-h-screen flex items-center bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-card pointer-events-none" />

          <div className="container mx-auto relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                  Optimize Your Website's Performance
                </span>
              </h1>

              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Get comprehensive SEO analysis and performance metrics to boost your website's
                visibility and speed. On-page, off-page, and technical SEO insights in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <div className="relative flex-1 max-w-md w-full">
                  <RootInput
                    name="url"
                    type="url"
                    placeholder="Ingresa la URL a analizar"
                    label="URL"
                    startContent={<Search className="text-gray-400 w-5 h-5" /> as React.ReactNode}  
                  />
                  {error && <p className="absolute text-red-500 text-sm mt-1">{error}</p>}
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-2"
                >
                  Analyze Now
                  <Zap className="w-4 h-4" />
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
