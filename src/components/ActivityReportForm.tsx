import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
import logo from '/uploads/logo.png';


interface ActivityReport {
  id: string;
  timestamp: number;
  year1: string;
  year2: string;
  department: string;
  iqacDocNo: string;
  activityTitle: string;
  coordinatorName: string;
  date: string;
  venue: string;
  time: string;
  timePeriod: string;

  participants: string;
  nature: string;
  activityType: string;
  customActivityType?: string;
  schedule: string;
  fundingSource: string;
  amount: number;
  chiefGuest: string;
  topic: string;
  objectives: string;
  methodology: string;
  outcomes: string;
  documentation: { [key: string]: boolean };
  footerIqacDoc: string;
  attributeName: string;
  deptFileNo: string;
  iqacFileNo: string;
  teacherName: string;
  teacherDate: string;
  headName: string;
  headDate: string;
  icPrincipalName: string;   // <-- Added property
  icPrincipalDate: string;   // <-- Added property
  iqacCoordinator: string;
  iqacDate: string;
}

const ActivityReportForm: React.FC = () => {
  const [formData, setFormData] = useState<ActivityReport>({
    id: '',
    timestamp: 0,
    year1: '',
    year2: '',
    department: '',
    iqacDocNo: '',
    activityTitle: '',
    coordinatorName: '',
    date: '',
    timePeriod: 'AM',
    venue: '',
    time: '',
    participants: '',
    nature: '',
    activityType: '',
    customActivityType: '',  // <-- Add this line
    schedule: '',
    fundingSource: '',
    amount: 0,
    chiefGuest: '',
    topic: '',
    objectives: '',
    methodology: '',
    outcomes: '',
    documentation: {},
    footerIqacDoc: '',
    attributeName: '',
    deptFileNo: '',
    iqacFileNo: '',
    teacherName: '',
    teacherDate: '',
    headName: '',
    headDate: '',
    icPrincipalName: '',      // <-- Add this line
    icPrincipalDate: '',      // <-- Add this line
    iqacCoordinator: '',
    iqacDate: ''
  });

  // ...rest of your component code



  const [savedReports, setSavedReports] = useState<ActivityReport[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = () => {
    const saved = localStorage.getItem('activityReports');
    if (saved) {
      setSavedReports(JSON.parse(saved));
    }
  };

  const saveReport = () => {
    const reportId = currentEditId || Date.now().toString();
    const reportToSave: ActivityReport = {
      ...formData,
      id: reportId,
      timestamp: Date.now()
    };

    const updatedReports = isEditing
      ? savedReports.map(report => report.id === currentEditId ? reportToSave : report)
      : [...savedReports, reportToSave];

    setSavedReports(updatedReports);
    localStorage.setItem('activityReports', JSON.stringify(updatedReports));

    toast({
      title: isEditing ? "Report Updated" : "Report Saved",
      description: "Activity report has been saved successfully."
    });

    setIsEditing(false);
    setCurrentEditId(null);
  };

  const editReport = (report: ActivityReport) => {
    setFormData(report);
    setIsEditing(true);
    setCurrentEditId(report.id);
    window.scrollTo(0, 0);
  };

  const deleteReport = (id: string) => {
    const updatedReports = savedReports.filter(report => report.id !== id);
    setSavedReports(updatedReports);
    localStorage.setItem('activityReports', JSON.stringify(updatedReports));

    toast({
      title: "Report Deleted",
      description: "Activity report has been deleted successfully."
    });
  };

  const clearForm = () => {
    setFormData({
      id: '',
      timestamp: 0,
      year1: '',
      year2: '',
      department: '',
      iqacDocNo: '',
      activityTitle: '',
      coordinatorName: '',
      date: '',
      timePeriod: 'AM',
      venue: '',
      time: '',
      participants: '',
      nature: '',
      activityType: '',
      customActivityType: '',
      schedule: '',
      fundingSource: '',
      amount: 0,
      chiefGuest: '',
      topic: '',
      objectives: '',
      methodology: '',
      outcomes: '',
      documentation: {},
      footerIqacDoc: '',
      attributeName: '',
      deptFileNo: '',
      iqacFileNo: '',
      teacherName: '',
      teacherDate: '',
      headName: '',
      headDate: '',
      icPrincipalName: '',  // <-- NEW
      icPrincipalDate: '',  // <-- NEW
      iqacCoordinator: '',
      iqacDate: ''
    });
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const exportToPDF = (data: ActivityReport = formData) => {
    // Switch to preview mode before export
    setIsPreviewMode(true);

    // Give time for DOM to update
    setTimeout(() => {
      const element = document.getElementById("report-content");

      const opt = {
        margin: 0,
        filename: `Activity_Report_${data.year1}_${data.year2}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794,
          windowHeight: 1123,
        },
        jsPDF: {
          unit: "px",
          format: [794, 1123],
          orientation: "portrait",
        },
      };

      html2pdf().set(opt).from(element).save().then(() => {
        // Revert back to editable mode after export
        setIsPreviewMode(false);
      });
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      {/* College Header - Web View */}
      <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-scroll text-lg font-bold text-center text-red-600">
          Official Academic Activity Form — Sheth L.U & M.V College of Science & Technology
        </div>
      </div>


      <div
        id="report-content"
        className="w-[794px] min-h-[1123px] p-6 mx-auto bg-white text-[13px] leading-snug font-serif border border-black overflow-hidden"
      >
        {/* College Header */}
        <div className="w-full border-b border-black mb-3">
          <img src={logo} alt="College Logo" className="w-full h-auto object-contain" />
        </div>


        {/* Header */}
        <div className="text-center border-b border-black pb-2 mb-3">
          <h1 className="text-lg font-bold mb-2">ACTIVITY REPORT</h1>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold leading-none font-mono tracking-normal align-middle">

            <span>Year: 20</span>
            {isPreviewMode ? (
              <span className="inline-block h-5 w-12 text-center border-b border-black">{formData.year1}</span>
            ) : (
              <input
                type="number"
                value={formData.year1}
                onChange={(e) => setFormData(prev => ({ ...prev, year1: e.target.value }))}
                className="inline-block h-5 w-12 text-center border-b border-black bg-transparent font-semibold"
                min="2020"
                max="2030"
              />
            )}
            <span>-</span>
            <span>20</span>
            {isPreviewMode ? (
              <span className="inline-block h-5 w-12 text-center border-b border-black">{formData.year2}</span>
            ) : (
              <input
                type="number"
                value={formData.year2}
                onChange={(e) => setFormData(prev => ({ ...prev, year2: e.target.value }))}
                className="inline-block h-5 w-12 text-center border-b border-black bg-transparent font-semibold"
                min="2020"
                max="2030"
              />
            )}
          </div>
        </div>


        {/* Department and IQAC Section */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block font-bold text-xs mb-1">DEPARTMENT / COMMITTEE:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs">{formData.department}</div>
            ) : (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-xs mb-2">IQAC Document No:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-1.5 text-xs font-mono tracking-normal leading-none align-middle">
                {formData.iqacDocNo}
              </div>
            ) : (
              <input
                type="text"
                value={formData.iqacDocNo}
                onChange={(e) => setFormData(prev => ({ ...prev, iqacDocNo: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs font-mono tracking-normal leading-none align-middle"
              />
            )}
          </div>

        </div>

        {/* Title Block */}
        <div className="mb-3">
          <label className="block font-bold text-xs mb-1">Title of Activity:</label>
          {isPreviewMode ? (
            <div className="w-full border-b border-black bg-transparent p-1 min-h-[2.5rem] text-xs">{formData.activityTitle}</div>
          ) : (
            <textarea
              value={formData.activityTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, activityTitle: e.target.value }))}
              className="w-full border-b border-black bg-transparent p-1 h-8 resize-none text-xs"
              rows={2}
            />
          )}
        </div>

        {/* Basic Information Grid */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block font-bold text-xs mb-1">Coordinator Name:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-1.5 text-xs">{formData.coordinatorName}</div>
            ) : (
              <input
                type="text"
                value={formData.coordinatorName}
                onChange={(e) => setFormData(prev => ({ ...prev, coordinatorName: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-xs mb-1">Day & Date:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs font-mono tracking-normal leading-none align-middle">
                {formData.date
                  ? `${new Date(formData.date).toLocaleDateString('en-GB', { weekday: 'short' })}, ${new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                  : 'N/A'}
              </div>
            ) : (
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs font-mono tracking-normal leading-none align-middle"
              />
            )}
          </div>



          <div>
            <label className="block font-bold text-xs mb-1">Venue:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-1 text-xs">{formData.venue}</div>
            ) : (
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-xs mb-1">Time:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs font-mono tracking-normal leading-none align-middle">
                {formData.time ? formData.time : 'HH:MM'} {formData.timePeriod ? formData.timePeriod : ''}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={formData.time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 text-xs"
                />
                <select
                  value={formData.timePeriod || 'AM'}
                  onChange={(e) => setFormData(prev => ({ ...prev, timePeriod: e.target.value }))}
                  className="border-b border-black bg-transparent pb-1 text-xs"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            )}
          </div>

        </div>

        {/* Participation Section */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block font-bold text-xs mb-1">Participants:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs">{formData.participants}</div>
            ) : (
              <input
                type="number"
                value={formData.participants}
                onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-2 text-xs"
              />
            )}
          </div>


          <div>
            <label className="block font-bold text-xs mb-1">Nature:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-white text-xs p-1">{formData.nature}</div>
            ) : (
              <select
                value={formData.nature}
                onChange={(e) => setFormData(prev => ({ ...prev, nature: e.target.value }))}
                className="w-full border-b border-black bg-white text-xs p-1"
              >
                <option value="">Select...</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor">Indoor</option>
                <option value="Online">Online</option>
              </select>
            )}
          </div>

          <div>
            <label className="block font-bold text-xs mb-1">Type of Activity:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-white text-xs p-1">
                {formData.activityType === "Other(Specify)"
                  ? (formData.customActivityType || "Other")
                  : formData.activityType || "N/A"}
              </div>
            ) : (
              <>
                {formData.activityType === "Other(Specify)" ? (
                  <input
                    type="text"
                    value={formData.customActivityType || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, customActivityType: e.target.value }))}
                    placeholder="Specify Type of Activity"
                    className="w-full border border-black bg-white text-xs p-1"
                  />
                ) : (
                  <select
                    value={formData.activityType}
                    onChange={(e) => setFormData(prev => ({ ...prev, activityType: e.target.value }))}
                    className="w-full border-b border-black bg-white text-xs p-1"
                  >
                    <option value="">Select...</option>
                    <option value="Academic">Academic</option>
                    <option value="Extension">Extension</option>
                    <option value="Student Progression">Student Progression</option>
                    <option value="Student Support">Student Support</option>
                    <option value="Environment">Environment</option>
                    <option value="Gender">Gender</option>
                    <option value="Days">Days</option>
                    <option value="Enrichment">Enrichment</option>
                    <option value="Other(Specify)">Other (Specify)</option>
                  </select>
                )}
              </>
            )}

          </div>
          <div>
            <label className="block  font-bold text-xs mb-1">Schedule:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs">{formData.schedule}</div>
            ) : (
              <div className="flex gap-2 text-xs">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Scheduled"
                    checked={formData.schedule === 'Scheduled'}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    className="mr-1 scale-75"
                  />
                  Scheduled
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Unscheduled"
                    checked={formData.schedule === 'Unscheduled'}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    className="mr-1 scale-75"
                  />
                  Unscheduled
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Funding and Chief Guest */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block font-bold text-xs mb-1">Funding Source:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs">{formData.fundingSource}</div>
            ) : (
              <input
                type="text"
                value={formData.fundingSource}
                onChange={(e) => setFormData(prev => ({ ...prev, fundingSource: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-xs mb-1">Amount:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs font-mono tracking-normal leading-none align-middle">
                {Number(formData.amount) || '0'}
              </div>
            ) : (
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) { // Accept only digits
                    setFormData(prev => ({ ...prev, amount: Number(value) }));
                  }
                }}
                className="w-full border-b border-black bg-transparent pb-1 text-xs font-mono tracking-normal leading-none align-middle"
              />
            )}
          </div>

          <div>
            <label className="block font-bold text-xs mb-1">Chief Guest Name:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs">{formData.chiefGuest}</div>
            ) : (
              <input
                type="text"
                value={formData.chiefGuest}
                onChange={(e) => setFormData(prev => ({ ...prev, chiefGuest: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
        </div>

        {/* Activity Details Table */}
        <div className="mb-3">
          <h3 className="font-bold text-sm mb-2 text-center">ACTIVITY DETAILS</h3>
          <div className="border border-black">
            <div className="grid grid-cols-2 gap-0">
              <div className="border-r border-black p-2">
                <label className="block font-bold text-xs mb-1">Topic / Subject:</label>
                {isPreviewMode ? (
                  <div className="w-full bg-transparent min-h-[3rem] text-xs">{formData.topic}</div>
                ) : (
                  <textarea
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full bg-transparent resize-none h-12 text-xs"
                    rows={2}
                  />
                )}
              </div>
              <div className="p-2">
                <label className="block font-bold text-xs mb-1">Objectives:</label>
                {isPreviewMode ? (
                  <div className="w-full bg-transparent min-h-[3rem] text-xs">{formData.objectives}</div>
                ) : (
                  <textarea
                    value={formData.objectives}
                    onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                    className="w-full bg-transparent resize-none h-12 text-xs"
                    rows={2}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-0 border-t border-black">
              <div className="border-r border-black p-2">
                <label className="block font-bold text-xs mb-1">Methodology:</label>
                {isPreviewMode ? (
                  <div className="w-full bg-transparent min-h-[3rem] text-xs">{formData.methodology}</div>
                ) : (
                  <textarea
                    value={formData.methodology}
                    onChange={(e) => setFormData(prev => ({ ...prev, methodology: e.target.value }))}
                    className="w-full bg-transparent resize-none h-12 text-xs"
                    rows={2}
                  />
                )}
              </div>
              <div className="p-2">
                <label className="block font-bold text-xs mb-1">Outcomes:</label>
                {isPreviewMode ? (
                  <div className="w-full bg-transparent min-h-[3rem] text-xs">{formData.outcomes}</div>
                ) : (
                  <textarea
                    value={formData.outcomes}
                    onChange={(e) => setFormData(prev => ({ ...prev, outcomes: e.target.value }))}
                    className="w-full bg-transparent resize-none h-12 text-xs"
                    rows={2}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mb-3">
          <h3 className="font-bold text-sm mb-2 text-center">DOCUMENTATION</h3>
          <div className="grid grid-cols-2 gap-1 text-xs leading-tight">
            {[
              'Approval letter',
              'Guest speaker invitation',
              'Notice',
              'Flyer',
              'Pre-Registration list',
              'Budget sanction',
              'Signature Attendance of Participants: Counter-signature by Guest',
              'High-quality, geotagged photos with accurate event tagging',
              'Some small reels of essential parts of the program',
              'Feedback & Feedback analysis',
              'Certificate of Appreciation',
              'Event Report',
              'Annual Report mentioning activity',
              'Publicity'
            ].map((item, index) => {
              const isChecked = formData.documentation[item] || false;

              if (isPreviewMode) {
                // Only show checked items with numbers
                const checkedItems = [
                  'Approval letter',
                  'Guest speaker invitation',
                  'Notice',
                  'Flyer',
                  'Pre-Registration list',
                  'Budget sanction',
                  'Signature Attendance of Participants: Counter-signature by Guest',
                  'High-quality, geotagged photos with accurate event tagging',
                  'Some small reels of essential parts of the program',
                  'Feedback & Feedback analysis',
                  'Certificate of Appreciation',
                  'Event Report',
                  'Annual Report mentioning activity',
                  'Publicity'
                ].filter(docItem => formData.documentation[docItem]);

                if (isChecked) {
                  const itemNumber = checkedItems.indexOf(item) + 1;

                  return (
                    <div key={index} className="flex items-center">
                      <span className="mr-1 scale-75 inline-block w-4 text-center font-bold">
                        {itemNumber}.
                      </span>
                      <span>{item}</span>
                    </div>
                  );
                }
                return null;
              }

              return (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      documentation: {
                        ...prev.documentation,
                        [item]: e.target.checked
                      }
                    }))}
                    className="mr-1 scale-75"
                  />
                  {item}
                </label>
              );
            })}
          </div>
        </div>



        {/* Footer Information */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block font-bold text-xs mb-1">IQAC Document No:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs font-mono tracking-normal leading-none align-middle">{formData.footerIqacDoc}</div>
            ) : (
              <input
                type="text"
                value={formData.footerIqacDoc}
                onChange={(e) => setFormData(prev => ({ ...prev, footerIqacDoc: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-xs mb-1">Attribute Name & No:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs font-mono tracking-normal leading-none align-middle">{formData.attributeName}</div>
            ) : (
              <input
                type="text"
                value={formData.attributeName}
                onChange={(e) => setFormData(prev => ({ ...prev, attributeName: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-xs mb-1">Departmental File No:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs font-mono tracking-normal leading-none align-middle">{formData.deptFileNo}</div>
            ) : (
              <input
                type="text"
                value={formData.deptFileNo}
                onChange={(e) => setFormData(prev => ({ ...prev, deptFileNo: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-xs mb-1">IQAC File No:</label>
            {isPreviewMode ? (
              <div className="w-full border-b border-black bg-transparent pb-2 text-xs font-mono tracking-normal leading-none align-middle">{formData.iqacFileNo}</div>
            ) : (
              <input
                type="text"
                value={formData.iqacFileNo}
                onChange={(e) => setFormData(prev => ({ ...prev, iqacFileNo: e.target.value }))}
                className="w-full border-b border-black bg-transparent pb-1 text-xs"
              />
            )}
          </div>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-4 gap-4">
          {/* Column 1 - Teacher */}
          <div className="text-center">
            <label className="block font-bold text-xs mb-1">NAME OF TEACHER</label>
            {isPreviewMode ? (
              <>

                <div className="w-full flex flex-col items-center">
                  <div className="w-full  border-black bg-transparent pb-1 text-center text-xs font-mono leading-none">
                    {formData.teacherName}
                  </div>

                  {/* Space for signature */}
                  <div className="h-6"></div> {/* Adjust height as needed (signature space) */}

                  <div className="w-full border-b border-black bg-transparent pb-2 text-center text-xs font-mono leading-none">
                    {formData.teacherDate
                      ? new Date(formData.teacherDate).toLocaleDateString('en-GB')
                      : ''}
                  </div>
                </div>

              </>
            ) : (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Teacher Name"
                  value={formData.teacherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teacherName: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 text-center text-xs font-mono leading-none"
                />
                <input
                  type="date"
                  value={formData.teacherDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, teacherDate: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 mt-2 text-center text-xs font-mono leading-none"
                />
              </div>
            )}
          </div>

          {/* Column 2 - Head/Committee Incharge */}
          <div className="text-center">
            <label className="block font-bold text-xs mb-1">COMMITTEE INCHARGE</label>
            {isPreviewMode ? (
              <>
                <div className="w-full  border-black bg-transparent pb-1 text-center text-xs font-mono leading-none">
                  {formData.headName}
                </div>
                {/* Space for signature */}
                <div className="h-6"></div> {/* Adjust height as needed (signature space) */}

                <div className="w-full border-b border-black bg-transparent pb-2 text-center text-xs font-mono leading-none">
                  {formData.teacherDate
                    ? new Date(formData.teacherDate).toLocaleDateString('en-GB')
                    : ''}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Head/Committee Incharge"
                  value={formData.headName}
                  onChange={(e) => setFormData(prev => ({ ...prev, headName: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 text-center text-xs font-mono leading-none"
                />
                <input
                  type="date"
                  value={formData.headDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, headDate: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 mt-2 text-center text-xs font-mono leading-none"
                />
              </div>
            )}
          </div>


          {/* Column 3 - IQAC Coordinator */}
          <div className="text-center">
            <label className="block font-bold text-xs mb-1">IQAC COORDINATOR</label>
            {isPreviewMode ? (
              <>
                <div className="w-full  border-black bg-transparent pb-1 text-center text-xs font-mono leading-none">
                  {formData.iqacCoordinator}
                </div>
                {/* Space for signature */}
                <div className="h-6"></div> {/* Adjust height as needed (signature space) */}

                <div className="w-full border-b border-black bg-transparent pb-2 text-center text-xs font-mono leading-none">
                  {formData.teacherDate
                    ? new Date(formData.teacherDate).toLocaleDateString('en-GB')
                    : ''}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="IQAC Coordinator"
                  value={formData.iqacCoordinator}
                  onChange={(e) => setFormData(prev => ({ ...prev, iqacCoordinator: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 text-center text-xs font-mono leading-none"
                />
                <input
                  type="date"
                  value={formData.iqacDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, iqacDate: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 mt-2 text-center text-xs font-mono leading-none"
                />
              </div>
            )}
          </div>

          {/* Column 4 - IC Principal */}
          <div className="text-center">
            <label className="block font-bold text-xs mb-1">IC PRINCIPAL</label>
            {isPreviewMode ? (
              <>
                <div className="w-full  border-black bg-transparent pb-1 text-center text-xs font-mono leading-none">
                  {formData.icPrincipalName}
                </div>
                {/* Space for signature */}
                <div className="h-6"></div> {/* Adjust height as needed (signature space) */}

                <div className="w-full border-b border-black bg-transparent pb-2 text-center text-xs font-mono leading-none">
                  {formData.teacherDate
                    ? new Date(formData.teacherDate).toLocaleDateString('en-GB')
                    : ''}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="IC Principal"
                  value={formData.icPrincipalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, icPrincipalName: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 text-center text-xs font-mono leading-none"
                />
                <input
                  type="date"
                  value={formData.icPrincipalDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, icPrincipalDate: e.target.value }))}
                  className="w-full border-b border-black bg-transparent pb-1 mt-2 text-center text-xs font-mono leading-none"
                />
              </div>
            )}
          </div>
          <label className="block font-bold text-xs mb-4">Remark:</label>

        </div>
        

      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6 print:hidden">
        <Button onClick={saveReport} className="px-6 py-2">
          {isEditing ? 'Update Report' : 'Save Report'}
        </Button>
        <Button onClick={() => exportToPDF()} variant="secondary" className="px-6 py-2">
          Export to PDF
        </Button>
        <Button onClick={clearForm} variant="outline" className="px-6 py-2">
          Clear Form
        </Button>
      </div>

      {/* History Section */}
      {savedReports.length > 0 && (
        <div className="bg-white p-6 rounded-lg border shadow-sm no-print">
          <h2 className="text-xl font-bold mb-4">Saved Reports History</h2>
          <div className="space-y-4">
            {savedReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{report.activityTitle || 'Untitled Activity'}</h3>
                    <p className="text-sm text-gray-600">
                      Department: {report.department} | Date: {report.date}
                    </p>
                    <p className="text-xs text-gray-500">
                      Saved: {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => editReport(report)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => exportToPDF(report)}>
                      Export PDF
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteReport(report.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityReportForm;