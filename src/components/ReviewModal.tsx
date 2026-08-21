import React, { useState } from 'react';
import { CLINIC_SERVICES, CLINIC_INFO } from '../data/clinicData';
import { TreatmentType } from '../types';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Star,
  Sparkles,
  Stethoscope,
  User,
  ShieldCheck,
  Tag,
  CheckCircle,
  FileCheck
} from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { addReview } = useClinic();
  const { user, isDoctor } = useAuth();

  const [authorName, setAuthorName] = useState<string>(
    user?.name || (isDoctor ? CLINIC_INFO.doctor : '')
  );
  const [role, setRole] = useState<'patient' | 'dentist'>(
    isDoctor ? 'dentist' : 'patient'
  );
  const [treatment, setTreatment] = useState<TreatmentType | 'General Care'>('Teeth Whitening');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [beforeDesc, setBeforeDesc] = useState<string>('');
  const [afterDesc, setAfterDesc] = useState<string>('');
  const [tag, setTag] = useState<string>('Cosmetic Dentistry');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      await addReview({
        authorName,
        authorRole: role,
        treatment,
        rating,
        title,
        comment,
        isVerifiedPatient: true,
        beforeAfterImage:
          beforeDesc.trim() || afterDesc.trim()
            ? {
                beforeDesc: beforeDesc.trim() || undefined,
                afterDesc: afterDesc.trim() || undefined,
                tag: tag.trim() || 'Smile Transformation',
              }
            : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-lg border border-teal-500/30">
              {role === 'dentist' ? '👨‍⚕️' : '⭐'}
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg tracking-tight">
                {role === 'dentist' ? 'Add Doctor Case Spotlight' : 'Share Patient Review'}
              </h3>
              <p className="text-[11px] text-slate-300">
                SmileCraft Dental Studio • Model Town, Ludhiana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
          
          {/* Dual Role Selector: As Patient OR As Dental Surgeon */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Posting As
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setRole('patient');
                  if (!user || user.role !== 'dentist') setAuthorName(user?.name || '');
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'patient'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Happy Patient</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('dentist');
                  setAuthorName(CLINIC_INFO.doctor);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'dentist'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Dr. Aarav Mehta</span>
              </button>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs text-slate-600 font-semibold mb-1">
              {role === 'dentist' ? 'Doctor / Surgeon Name' : 'Your Name *'}
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={role === 'dentist' ? CLINIC_INFO.doctor : 'e.g. Navjot Kaur'}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 text-xs font-medium bg-slate-50"
              required
            />
          </div>

          {/* Treatment Category & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs text-slate-600 font-semibold mb-1">
                Treatment / Case Type
              </label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value as TreatmentType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 text-xs font-medium bg-white"
              >
                {CLINIC_SERVICES.map(s => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="General Care">General Hygiene & Care</option>
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs text-slate-600 font-semibold mb-1">
                Rating ({rating} of 5 Stars)
              </label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs text-slate-600 font-semibold mb-1">
              {role === 'dentist' ? 'Case Title / Clinical Highlight *' : 'Review Title *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                role === 'dentist'
                  ? 'e.g. Clinical Case: Full Arch Ceramic Veneers & Diastema Closure'
                  : 'e.g. Painless root canal and friendly clinic atmosphere!'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 text-xs font-medium bg-slate-50"
              required
            />
          </div>

          {/* Comment / Story */}
          <div>
            <label className="block text-xs text-slate-600 font-semibold mb-1">
              {role === 'dentist' ? 'Clinical Procedure Details & Result *' : 'Your Detailed Experience *'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                role === 'dentist'
                  ? 'Describe patient condition, clinical steps taken (e.g. rotary endodontics / digital impressions), and treatment outcome...'
                  : 'Share how Dr. Aarav Mehta and staff treated you, pain level, clinic hygiene, and overall results...'
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-teal-500 text-xs font-medium bg-slate-50"
              required
            />
          </div>

          {/* Optional Before / After Outcome Details */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Before & After Transformation Notes (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Initial Problem / Before</label>
                <input
                  type="text"
                  value={beforeDesc}
                  onChange={(e) => setBeforeDesc(e.target.value)}
                  placeholder="e.g. Discolored front teeth & chipped corner"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Final Outcome / After</label>
                <input
                  type="text"
                  value={afterDesc}
                  onChange={(e) => setAfterDesc(e.target.value)}
                  placeholder="e.g. 4 E-Max porcelain veneers with bright shine"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Verified Badge Guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              All reviews are verified by SmileCraft Studio for patient authenticity.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-full font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Review'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
