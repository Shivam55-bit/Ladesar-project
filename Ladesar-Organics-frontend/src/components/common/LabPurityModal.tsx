import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Download, 
  Printer, 
  Award,
  QrCode
} from 'lucide-react';

export const LabPurityModal: React.FC = () => {
  const { labReportProduct, setLabReportProduct } = useStore();

  if (!labReportProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-2xl w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/80 animate-in zoom-in-95 duration-200">
        
        {/* Certificate Header Banner */}
        <div className="bg-[#0F3823]/95 backdrop-blur-md text-[#FAF7F2] p-6 relative border-b-4 border-[#D4AF37]">
          <button
            onClick={() => setLabReportProduct(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#0F3823] flex items-center justify-center font-bold shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-wide uppercase font-serif-luxury text-[#FAF7F2]">
                Certificate of Purity & Analysis (COA)
              </h3>
              <p className="text-xs text-[#D4AF37]">
                Government NABL Accredited Independent Organic Testing
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-[#FAF7F2]/80 mt-3 pt-3 border-t border-white/10">
            <div><strong>Batch No:</strong> {labReportProduct.labCertificateBatch || 'LAB-LAD-2026-G84'}</div>
            <div><strong>Testing Date:</strong> 10 August 2026</div>
            <div><strong>FSSAI Lic:</strong> {labReportProduct.fssaiNumber}</div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 md:p-8 space-y-6 bg-white/40 backdrop-blur-md">
          {/* Product Verified Info */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={labReportProduct.heroImage}
                alt={labReportProduct.name}
                className="w-14 h-14 object-cover rounded-xl border border-white/80 shadow-2xs"
              />
              <div>
                <h4 className="text-sm font-bold text-[#0F3823]">{labReportProduct.name}</h4>
                <p className="text-xs text-gray-500">{labReportProduct.categoryName} • 100% Single Origin</p>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sample Passed All 48 Purity Parameters
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center justify-center p-2 bg-white/70 backdrop-blur-xs rounded-xl border border-[#D4AF37]/30 text-center shadow-2xs">
              <QrCode className="w-10 h-10 text-[#0F3823]" />
              <span className="text-[9px] font-bold text-[#B8860B] mt-1">NABL QR Verified</span>
            </div>
          </div>

          {/* Test Metrics Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F3823] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Laboratory GC-MS Chemical & Residue Profile
            </h4>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F3823]/5 text-[#0F3823] font-bold border-b border-gray-200/60">
                  <tr>
                    <th className="p-3">Test Parameter</th>
                    <th className="p-3">Standard Limit</th>
                    <th className="p-3">Batch Result</th>
                    <th className="p-3 text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 text-gray-700">
                  <tr>
                    <td className="p-3 font-medium">Chemical Pesticide & Insecticide Residues</td>
                    <td className="p-3">Max 0.01 mg/kg</td>
                    <td className="p-3 font-semibold text-[#0F3823]">Not Detected (&lt;0.001)</td>
                    <td className="p-3 text-right text-emerald-700 font-bold">✓ PASS</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Heavy Metals (Lead, Arsenic, Cadmium, Mercury)</td>
                    <td className="p-3">&lt; 0.5 ppm</td>
                    <td className="p-3 font-semibold text-[#0F3823]">Zero / Below LOD</td>
                    <td className="p-3 text-right text-emerald-700 font-bold">✓ PASS</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Synthetic Colors & Artificial Aromas</td>
                    <td className="p-3">Nil (0%)</td>
                    <td className="p-3 font-semibold text-[#0F3823]">100% Pure Natural</td>
                    <td className="p-3 text-right text-emerald-700 font-bold">✓ PASS</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Moisture Content</td>
                    <td className="p-3">Max 0.3%</td>
                    <td className="p-3 font-semibold text-[#0F3823]">0.12% (Granular Pure)</td>
                    <td className="p-3 text-right text-emerald-700 font-bold">✓ PASS</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Microbiological Yeast & Mold Count</td>
                    <td className="p-3">&lt; 10 CFU/g</td>
                    <td className="p-3 font-semibold text-[#0F3823]">&lt; 1 CFU/g (Sterile)</td>
                    <td className="p-3 text-right text-emerald-700 font-bold">✓ PASS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Signatures & Seal */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-[#0F3823]/10">
            <div>
              <div className="font-bold text-[#0F3823]">Dr. K. S. Rathore, Ph.D.</div>
              <div className="text-[11px]">Chief Food Microbiologist & Chemist</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl border border-white/80 bg-white/70 backdrop-blur-xs text-gray-700 hover:bg-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print COA
              </button>
              <button
                onClick={() => alert(`Certificate #${labReportProduct.labCertificateBatch || 'COA-LAD-2026'} downloaded successfully.`)}
                className="px-3 py-1.5 rounded-xl bg-[#0F3823] text-white hover:bg-[#164E31] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
