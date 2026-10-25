import React from 'react';
import { ComplaintEvent, ActorRole } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Cpu,
  UserCheck,
  Wrench,
  AlertTriangle,
  ArrowUpCircle,
  CheckCircle,
  XCircle,
  Clock,
  ShieldAlert,
  Send,
  Building
} from 'lucide-react';

interface TimelineViewProps {
  events: ComplaintEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  const { language } = useAuth();

  const getEventIcon = (eventType: ComplaintEvent['eventType']) => {
    switch (eventType) {
      case 'complaint_created':
        return <Send className="w-4 h-4 text-sky-600" />;
      case 'department_assigned':
        return <Cpu className="w-4 h-4 text-indigo-600" />;
      case 'acknowledgement_recorded':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'crew_dispatched':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'deadline_missed':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'escalation_recorded':
        return <ArrowUpCircle className="w-4 h-4 text-purple-600" />;
      case 'resolution_submitted':
        return <CheckCircle className="w-4 h-4 text-teal-600" />;
      case 'resolution_confirmed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'resolution_disputed':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActorBadge = (role: ActorRole) => {
    switch (role) {
      case 'citizen':
        return { label: 'Citizen Action', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'system_ai':
        return { label: 'Gemini AI Engine', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'officer':
        return { label: 'Ward Field Officer', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'supervisor':
        return { label: 'Supervising Officer', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'admin':
        return { label: 'Municipal Commissioner Cell', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Municipal Registry', bg: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3.5 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {sortedEvents.map((event, index) => {
        const actor = getActorBadge(event.actorRole);
        const localizedDesc =
          language === 'mr' && event.descriptionMr
            ? event.descriptionMr
            : language === 'hi' && event.descriptionHi
            ? event.descriptionHi
            : event.description;

        const isLast = index === sortedEvents.length - 1;

        return (
          <div key={event.id} className="relative group">
            {/* Timeline node icon */}
            <div
              className={`absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                isLast ? 'border-sky-500 ring-4 ring-sky-50' : 'border-slate-300'
              }`}
            >
              {getEventIcon(event.eventType)}
            </div>

            {/* Event Content Box */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isLast
                ? 'bg-white border-sky-200 shadow-sm'
                : 'bg-white/80 border-slate-200/80 shadow-2xs'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${actor.bg}`}
                  >
                    {actor.label}
                  </span>
                  {event.eventType === 'deadline_missed' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      SLA Overdue
                    </span>
                  )}
                  {event.eventType === 'escalation_recorded' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Escalated
                    </span>
                  )}
                </div>

                <time className="text-[11px] font-medium text-slate-400">
                  {new Date(event.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}{' '}
                  at{' '}
                  {new Date(event.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {localizedDesc}
              </p>

              {event.metadata && (
                <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
                  {event.metadata.authority && (
                    <span>
                      <strong>Escalated Authority:</strong> {event.metadata.authority}
                    </span>
                  )}
                  {event.metadata.reason && (
                    <span>
                      <strong>Reason:</strong> {event.metadata.reason}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
