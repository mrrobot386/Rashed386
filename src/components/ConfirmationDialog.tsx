import React from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  toolName: string;
  actionName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  toolName,
  actionName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-2xl p-5 shadow-2xl shadow-amber-500/10 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{title || 'Permission Required'}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-700/60">
                Confirm
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{description}</p>
            <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              Tool: <span className="text-amber-300">{toolName}</span>
              {actionName && <span> • Action: <span className="text-amber-300">{actionName}</span></span>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Approve Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
