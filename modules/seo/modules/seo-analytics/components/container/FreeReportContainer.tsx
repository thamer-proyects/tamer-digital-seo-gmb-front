import AnalysisContent from './AnalysisContent';

export default function FreeReportContainer() {
  return (
    <div className="py-4 px-16 h-screen">
      <div className=" max-h-screen overflow-auto text-black dark:text-white ">
        <AnalysisContent />
      </div>
    </div>
  );
}
