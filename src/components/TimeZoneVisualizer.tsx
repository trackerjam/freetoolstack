import React, { useState, useEffect } from 'react';
import { Clock, Plus, X, Info } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  timezone: string;
}

const COMMON_TIMEZONES = [
  { name: 'New York', zone: 'America/New_York' },
  { name: 'Los Angeles', zone: 'America/Los_Angeles' },
  { name: 'London', zone: 'Europe/London' },
  { name: 'Paris', zone: 'Europe/Paris' },
  { name: 'Tokyo', zone: 'Asia/Tokyo' },
  { name: 'Sydney', zone: 'Australia/Sydney' },
  { name: 'Singapore', zone: 'Asia/Singapore' },
  { name: 'Dubai', zone: 'Asia/Dubai' },
  { name: 'Berlin', zone: 'Europe/Berlin' },
  { name: 'Toronto', zone: 'America/Toronto' },
  { name: 'São Paulo', zone: 'America/Sao_Paulo' },
  { name: 'Mumbai', zone: 'Asia/Kolkata' },
];

export default function TimeZoneVisualizer() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addMember = () => {
    if (!newMember.trim()) return;

    const matchingTimezone = COMMON_TIMEZONES.find(
      tz => tz.name.toLowerCase() === newMember.toLowerCase()
    );

    if (matchingTimezone) {
      setMembers([...members, {
        id: Date.now().toString(),
        name: matchingTimezone.name,
        timezone: matchingTimezone.zone
      }]);
      setNewMember('');
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const getLocalTime = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(currentTime);
  };

  const getLocalDay = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long'
    }).format(currentTime);
  };

  const isWorkingHours = (timezone: string) => {
    const hour = new Date(
      new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        hour12: false
      }).format(currentTime)
    ).getHours();

    return hour >= 9 && hour < 17;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Team Time Zone Visualizer</h1>
        
        {showGuide && (
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Available Cities</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm text-blue-800">
                    {COMMON_TIMEZONES.map(tz => (
                      <div key={tz.zone}>{tz.name}</div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Enter city name..."
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
              list="cities"
            />
            <datalist id="cities">
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.zone} value={tz.name} />
              ))}
            </datalist>
            <button
              onClick={addMember}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isWorkingHours(member.timezone)
                        ? 'bg-green-500'
                        : 'bg-slate-300'
                    }`} />
                    <span className="font-medium text-slate-900">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{getLocalTime(member.timezone)}</span>
                    <span className="text-slate-400">|</span>
                    <span>{getLocalDay(member.timezone)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              Add team members to see their local time
            </div>
          )}
        </div>
      </div>
    </div>
  );
}