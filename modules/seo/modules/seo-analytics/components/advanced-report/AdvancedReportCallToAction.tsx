import RootCard from '@/components/ui/root-card';
import { Button, CardBody } from '@heroui/react';
import useSeoAnalyticsStore from '../../store/seoAnalyticsStore';
import { useAnalysis } from '../../hooks/useAnalysis';

const AdvancedReportCallToAction = () => {
  const { urlToAnalyze } = useSeoAnalyticsStore();
  const { createAdvancedAnalysis } = useAnalysis();

  return (
    <div className="p-8 w-full mt-6 mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
          Want to{' '}
          <span className="bg-gradient-to-r from-secondaryLight to-secondaryDark bg-clip-text text-transparent font-bold">
            Stop Losing Traffic
          </span>{' '}
          to Your Competitors?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Choose your path to dominate search rankings and boost organic traffic
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* DIY Analysis Card */}
        <RootCard className="p-6">
          <CardBody className="text-center">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-2">
              In-Depth SEO Analysis
            </h4>
            <p className="text-gray-800 dark:text-gray-400 mb-4">
              Complete technical audit revealing every opportunity to outrank your competition
            </p>
            <ul className="text-left mb-6 space-y-2">
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0">✔</span>
                Find ALL your SEO issues
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0">✔</span>
                Get step-by-step fix guides
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0">✔</span>
                Discover missing keywords
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0">✔</span>
                Technical optimization blueprint
              </li>
            </ul>
            <Button
              onPress={async () => {
                await createAdvancedAnalysis(urlToAnalyze);
              }}
              className="w-full bg-gradient-to-br from-secondaryLight to-secondaryDark my-2 px-6 py-6 text-white rounded-lg hover:bg-blue-600 transition-colors text-center flex flex-col items-center gap-0"
            >
              <span className="font-semibold">Get Full Analysis</span>
              <span className="text-sm text-blue-200">1200 Credits</span>
            </Button>
          </CardBody>
        </RootCard>

        {/* Expert Service Card */}
        <RootCard className="p-6 overflow-visible rounded-xl bg-gradient-to-br from-secondaryLight/20 to-secondaryDark-200/20 border border-secondaryLight/40 text-center relative">
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-secondaryDark text-xs font-medium text-white rounded-full">
            Recommended
          </div>
          <CardBody className="text-center">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-2">
              Done-For-You SEO Optimization
            </h4>
            <p className="text-gray-800 dark:text-gray-400 mb-4">
              Our experts will fix everything holding back your rankings
            </p>
            <ul className="text-left mb-6 space-y-2">
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0">✔</span>
                Full technical optimization
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0">✔</span>
                Meta tags optimization
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0">✔</span>
                Content structure fixes
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0">✔</span>
                2-week implementation
              </li>
            </ul>

            <Button className="w-full bg-gradient-to-br from-secondaryLight to-secondaryDark px-6 py-6 text-white rounded-lg hover:bg-blue-600 transition-colors text-center flex flex-col items-center gap-0">
              <span className="font-semibold">Get Expert Implementation</span>
              <span className="text-sm text-green-200">$125 One-time Optimization</span>
            </Button>
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
};

export default AdvancedReportCallToAction;
