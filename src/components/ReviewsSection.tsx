import React, { useState } from 'react';
import { CLINIC_INFO, CLINIC_SERVICES } from '../data/clinicData';
import { Review } from '../types';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  ShieldCheck,
  Heart,
  MessageSquare,
  Sparkles,
  PlusCircle,
  Stethoscope,
  User,
  Filter,
  CheckCircle,
  ThumbsUp,
  Share2,
  Calendar
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, likeReview, addDoctorReply, openReviewModal, openBooking } = useClinic();
  const { user, isDoctor } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState<string>('');

  const filterOptions = [
    'All',
    'Ceramic Veneers & Smile Makeover',
    'Root Canal Treatment (RCT)',
    'Clear Aligners & Braces',
    'Teeth Whitening',
    'Dental Implants',
    'General Consultation',
  ];

  const filteredReviews = reviews.filter(rev => {
    const matchesTreatment = selectedFilter === 'All' || rev.treatment === selectedFilter;
    const matchesRating = minRating === 0 || rev.rating >= minRating;
    return matchesTreatment && matchesRating;
  });

  const handlePostDoctorReply = (reviewId: string) => {
    if (!replyComment.trim()) return;
    addDoctorReply(reviewId, replyComment);
    setReplyingToId(null);
    setReplyComment('');
  };

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Stats Overview Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Happy Patient Stories & Clinical Cases</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Real Smiles. Verified Experiences.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Over <strong className="text-white font-bold">{CLINIC_INFO.patientsTreated}</strong> patients trust Dr. Aarav Mehta for gentle, precision dental care in Model Town, Ludhiana.
              </p>
            </div>

            {/* Overall Rating Box */}
            <div className="lg:col-span-5 bg-white/5 rounded-xl p-5 border border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400">
                    {CLINIC_INFO.rating}
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Based on 840+ Clinic Reviews</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-teal-400" /> 100% Painless RCT
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-teal-400" /> 99.4% Recommend
                  </span>
                </div>
              </div>

              {/* Action: Add Review */}
              <div className="flex flex-col w-full sm:w-auto gap-2">
                <button
                  onClick={openReviewModal}
                  className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isDoctor ? 'Post Case' : 'Write Review'}</span>
                </button>
                <button
                  onClick={() => openBooking()}
                  className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-full border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          
          {/* Treatment Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3 h-3 text-slate-400" /> Filter:
            </span>
            {filterOptions.map(option => (
              <button
                key={option}
                onClick={() => setSelectedFilter(option)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === option
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Star Filter & Counter */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-slate-500 font-medium">Rating:</span>
            <button
              onClick={() => setMinRating(minRating === 5 ? 0 : 5)}
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                minRating === 5
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>5★ Only</span>
            </button>
            <span className="text-slate-400">({filteredReviews.length} reviews)</span>
          </div>

        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review, idx) => {
            const isDoctorPost = review.authorRole === 'dentist';
            const avatarColors = [
              'bg-orange-100 text-orange-700',
              'bg-blue-100 text-blue-700',
              'bg-emerald-100 text-emerald-700',
              'bg-purple-100 text-purple-700',
              'bg-teal-100 text-teal-700',
            ];
            const avatarColorClass = isDoctorPost
              ? 'bg-teal-600 text-white shadow-xs'
              : avatarColors[idx % avatarColors.length];

            return (
              <div
                key={review.id}
                className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  isDoctorPost
                    ? 'bg-teal-50/40 border-teal-200 shadow-sm'
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Row: Author details + Verified Badge + Stars */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColorClass}`}
                      >
                        {isDoctorPost ? '👨‍⚕️' : review.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-heading font-bold text-slate-800 text-sm">
                            {review.authorName}
                          </h4>
                          {isDoctorPost ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-teal-600 text-white rounded-full">
                              Surgeon
                            </span>
                          ) : (
                            review.isVerifiedPatient && (
                              <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                                Verified
                              </span>
                            )
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">{review.date} • Model Town Clinic</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Treatment Pill & Title */}
                  <div className="mb-2">
                    <span className="inline-block text-[10px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 mb-1">
                      {review.treatment}
                    </span>
                    <h5 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                      {review.title}
                    </h5>
                  </div>

                  {/* Review Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    “{review.comment}”
                  </p>

                  {/* Before / After Case Transformation Box */}
                  {review.beforeAfterImage && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 pb-1 border-b border-slate-200">
                        <span className="flex items-center gap-1 text-teal-700">
                          <Sparkles className="w-3 h-3" />
                          Smile Transformation Summary
                        </span>
                        <span className="text-slate-400 font-normal">
                          {review.beforeAfterImage.tag}
                        </span>
                      </div>
                      {review.beforeAfterImage.beforeDesc && (
                        <p className="text-slate-600 text-[11px]">
                          <strong className="text-slate-800">Initial:</strong> {review.beforeAfterImage.beforeDesc}
                        </p>
                      )}
                      {review.beforeAfterImage.afterDesc && (
                        <p className="text-teal-800 font-medium text-[11px]">
                          <strong className="text-teal-900">Result:</strong> {review.beforeAfterImage.afterDesc}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Doctor Response Section */}
                  {review.doctorResponse && (
                    <div className="mt-2.5 p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-950 flex items-center gap-1.5 text-[11px]">
                          <Stethoscope className="w-3 h-3 text-teal-600" />
                          {review.doctorResponse.doctorName}
                        </span>
                        <span className="text-[10px] text-teal-700">{review.doctorResponse.date}</span>
                      </div>
                      <p className="text-teal-900 italic text-[11px]">
                        “{review.doctorResponse.comment}”
                      </p>
                    </div>
                  )}

                  {/* Inline Doctor Reply Form (If user is signed in as Dr. Aarav Mehta) */}
                  {isDoctor && !review.doctorResponse && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      {replyingToId === review.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={replyComment}
                            onChange={(e) => setReplyComment(e.target.value)}
                            placeholder="Write doctor response to patient..."
                            className="w-full p-2.5 rounded-xl border border-teal-300 text-xs bg-white focus:outline-hidden"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setReplyingToId(null)}
                              className="px-3 py-1 rounded-full text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handlePostDoctorReply(review.id)}
                              className="px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white shadow-xs cursor-pointer"
                            >
                              Submit Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingToId(review.id)}
                          className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reply as Dr. Aarav Mehta</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Likes & Verified Tag */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button
                    onClick={() => likeReview(review.id)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-slate-100 text-slate-600 hover:text-teal-600 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3 text-teal-600" />
                    <span>Helpful ({review.likes})</span>
                  </button>

                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    SmileCraft Studio
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner to prompt user review */}
        <div className="mt-10 text-center p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-lg mx-auto">
          <p className="text-xs text-slate-700 font-medium">
            Treated by Dr. Aarav Mehta recently at SmileCraft?
          </p>
          <button
            onClick={openReviewModal}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Add Your Review / Story</span>
          </button>
        </div>

      </div>
    </section>
  );
};
