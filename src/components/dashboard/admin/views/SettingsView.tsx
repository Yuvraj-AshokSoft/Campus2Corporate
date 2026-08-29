import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Loader2,
  X
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const SettingsView: React.FC = () => {
  const [academicWeight, setAcademicWeight] = useState(40);
  const [softSkillsWeight, setSoftSkillsWeight] = useState(30);
  const [techProjectsWeight, setTechProjectsWeight] = useState(20);
  const [extracurricularWeight, setExtracurricularWeight] = useState(10);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [linkedInSync, setLinkedInSync] = useState(true);
  const [youTubeSync, setYouTubeSync] = useState(true);
  const [leetCodeSync, setLeetCodeSync] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSystemSettings();
      if (data) {
        if (data.aiReadinessWeights) {
          setAcademicWeight(data.aiReadinessWeights.academicWeight ?? 40);
          setSoftSkillsWeight(data.aiReadinessWeights.softSkillsWeight ?? 30);
          setTechProjectsWeight(data.aiReadinessWeights.techProjectsWeight ?? 20);
          setExtracurricularWeight(data.aiReadinessWeights.extracurricularWeight ?? 10);
        }
        if (data.maintenanceMode) {
          setMaintenanceMode(Boolean(data.maintenanceMode.enabled));
        }
        if (data.apiIntegrations) {
          setLinkedInSync(Boolean(data.apiIntegrations.linkedIn));
          setYouTubeSync(Boolean(data.apiIntegrations.youTube));
          setLeetCodeSync(Boolean(data.apiIntegrations.leetCode));
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      triggerToast('⚠️ Unable to fetch settings from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const totalWeight = academicWeight + softSkillsWeight + techProjectsWeight + extracurricularWeight;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      triggerToast(`⚠️ Total AI Readiness weights must sum to exactly 100% (currently ${totalWeight}%).`);
      return;
    }

    setIsSaving(true);
    try {
      await adminApi.updateSystemSettings({
        aiReadinessWeights: {
          academicWeight,
          softSkillsWeight,
          techProjectsWeight,
          extracurricularWeight,
        },
        maintenanceMode: {
          enabled: maintenanceMode,
          message: 'Platform undergoing scheduled maintenance.',
        },
        apiIntegrations: {
          linkedIn: linkedInSync,
          youTube: youTubeSync,
          leetCode: leetCodeSync,
        },
      });
      triggerToast('🎉 Global platform settings and AI weights saved successfully.');
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to update system settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setAcademicWeight(40);
    setSoftSkillsWeight(30);
    setTechProjectsWeight(20);
    setExtracurricularWeight(10);
    triggerToast('Defaults restored (40/30/20/10). Remember to click Save.');
  };

  return (
    <div className="space-y-8 font-sans text-slate-800 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings & Algorithm Control</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Configure global AI readiness scoring parameters, security policies, and maintenance mode.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving || isLoading}
            className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Configurations</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 bg-white rounded-2xl border border-purple-100/70 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading system settings from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: AI Readiness Scoring Formula Weights */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-purple-100/70 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">AI Readiness Scoring Weights</h3>
              </div>
              <span
                className={`font-mono text-xs font-black px-2.5 py-1 rounded-full ${
                  totalWeight === 100
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                Sum: {totalWeight}% / 100%
              </span>
            </div>

            <div className="space-y-5">
              {/* Slider 1: Academic */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Academic Standing & Percentage Weight</span>
                  <span className="font-mono text-purple-700">{academicWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={academicWeight}
                  onChange={(e) => setAcademicWeight(Number(e.target.value))}
                  className="w-full accent-[#6D28D9] cursor-pointer"
                />
              </div>

              {/* Slider 2: Soft Skills */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Soft Skills, Communication & Mock Interviews</span>
                  <span className="font-mono text-purple-700">{softSkillsWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={softSkillsWeight}
                  onChange={(e) => setSoftSkillsWeight(Number(e.target.value))}
                  className="w-full accent-[#6D28D9] cursor-pointer"
                />
              </div>

              {/* Slider 3: Tech Projects */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Technical Projects, GitHub & Coding Assessments</span>
                  <span className="font-mono text-purple-700">{techProjectsWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={techProjectsWeight}
                  onChange={(e) => setTechProjectsWeight(Number(e.target.value))}
                  className="w-full accent-[#6D28D9] cursor-pointer"
                />
              </div>

              {/* Slider 4: Extracurricular */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Extracurriculars & Leadership Activities</span>
                  <span className="font-mono text-purple-700">{extracurricularWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={extracurricularWeight}
                  onChange={(e) => setExtracurricularWeight(Number(e.target.value))}
                  className="w-full accent-[#6D28D9] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Platform Maintenance & Integrations */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/70 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-purple-700" />
              <h3 className="text-base font-bold text-slate-900">Platform Maintenance & API</h3>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-slate-900">Platform Maintenance Mode</p>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Restricts non-admin user logins during upgrades.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 rounded text-[#6D28D9] accent-[#6D28D9] cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">
                  External Provider Integrations
                </p>

                <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-purple-50/40">
                  <span>LinkedIn Profile Sync</span>
                  <input
                    type="checkbox"
                    checked={linkedInSync}
                    onChange={(e) => setLinkedInSync(e.target.checked)}
                    className="accent-[#6D28D9]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-purple-50/40">
                  <span>YouTube Education Hub Sync</span>
                  <input
                    type="checkbox"
                    checked={youTubeSync}
                    onChange={(e) => setYouTubeSync(e.target.checked)}
                    className="accent-[#6D28D9]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-purple-50/40">
                  <span>LeetCode Competitive Sync</span>
                  <input
                    type="checkbox"
                    checked={leetCodeSync}
                    onChange={(e) => setLeetCodeSync(e.target.checked)}
                    className="accent-[#6D28D9]"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
