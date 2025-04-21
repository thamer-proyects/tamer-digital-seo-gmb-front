"use client"

import { useState } from "react"
import useSeoAnalyticsStore from "../../store/seoAnalyticsStore"
import AdvancedReportCallToAction from "../advanced-report/AdvancedReportCallToAction"
import { PerformanceHeader } from "../free-report/pages-speed-insights/PerformanceHeader"
import PagesSpeedInsights from "../free-report/pages-speed-insights/PagesSpeedInsights"
import SeoOnPageSummary from "../free-report/seo-onpage-summary/SeoOnPageSummary"
import Tabs from "@/components/ui/tabs"
import { Link } from "@heroui/react"
import { EnhancedPageAnalysisResponse , generateFreeReportPDF } from "@/modules/seo/utils/generateFreeReport"
import { useContext } from "react"
import { LoadingContext } from "@/store/loadingContext"
import { redirect } from "next/navigation"
import ReportForm, { type CompanyInfo } from "@/modules/seo/utils/FormReport"


const AnalysisContent = () => {
  const { freeAnalysisResponse, urlToAnalyze } = useSeoAnalyticsStore()
  const { setLoading, setMessage } = useContext(LoadingContext)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!freeAnalysisResponse) return redirect("/seo/analysis")

  const handleGenerateReport = async (companyInfo: CompanyInfo) => {
    try {
      setIsGenerating(true)
      setLoading(true)
      setMessage("Creating PDF report")

      // Create a modified version of the analysis response with the company info
      const enhancedAnalysisResponse = {
        ...freeAnalysisResponse,
        companyInfo: companyInfo,
      } as EnhancedPageAnalysisResponse;

      // Pass the enhanced data to the PDF generator
      await generateFreeReportPDF(enhancedAnalysisResponse)
    } catch (e) {
      console.error(`Error generating free report: ${e}`)
    } finally {
      setIsGenerating(false)
      setLoading(false)
    }
  }

  const tabs = [
    {
      id: "pages-speed-insights",
      label: "Pages Speed Insights",
      content: (
        <div className="flex flex-col w-full h-[85vh]">
          <PerformanceHeader />
          <div className="grid grid-cols-1 w-full gap-6">
            <PagesSpeedInsights />
          </div>
        </div>
      ),
    },
    {
      id: "seo-onpage-summary",
      label: "SEO On-Page Summary",
      content: (
        <div className="flex flex-wrap gap-6 justify-between w-full h-[85vh]">
          <div className="flex-1 min-w-[300px] mt-3">
            <SeoOnPageSummary />
            <AdvancedReportCallToAction />
          </div>
        </div>
      ),
    },
  ]

  // Custom trigger button that matches the original styling
 // const downloadButton = (
  //  <Button
  //      className="fixed bottom-4 right-4 flex items-center gap-2 z-50 bg-green-500 hover:bg-green-600 text-white"
  //   color="primary"
  //    onPress={() => {}} // Función vacía ya que el clic real lo manejará el formulario
   // >
   //   Download PDFs
 //   </Button>
 // )

  return (
    freeAnalysisResponse && (
      <div className="w-full">
        <div className="text-center py-4 px-6 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Analysis results for:</h2>
          <Link className="text-sm md:text-base text-blue-400 truncate">{urlToAnalyze}</Link>
        </div>

        <Tabs tabs={tabs} />

        {/* Reemplazar el botón original con nuestro formulario */}
        <ReportForm onSubmit={handleGenerateReport} isLoading={isGenerating}  />
      </div>
    )
  )
}

export default AnalysisContent

