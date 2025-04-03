import React, { useState } from 'react';
import { Calendar, Clock, Video, Mail, Plus, X } from 'lucide-react';
import ToolHeader from './ToolHeader';

interface TimeSlot {
  id: string;
  day: string;
  time: string;
}

export default function AppointmentScheduler() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState('30');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const addTimeSlot = () => {
    const newSlot = {
      id: Date.now().toString(),
      day: '',
      time: ''
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(slots =>
      slots.map(slot =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(slots => slots.filter(slot => slot.id !== id));
  };

  const handleSchedule = () => {
    const selectedTime = timeSlots.find(slot => slot.id === selectedSlot);
    if (!selectedTime) return;

    const emailBody = `
Hello ${name},

Your appointment has been scheduled for ${selectedTime.day} at ${selectedTime.time}.
Duration: ${duration} minutes

Join Zoom meeting: https://zoom.us/j/example

Best regards,
Appointment Scheduler
    `;

    window.location.href = `mailto:${email}?subject=Appointment Confirmation&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Appointment Scheduler" 
          description="Schedule meetings with Zoom integration"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-field"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Available Time Slots
                </label>
                <button
                  onClick={addTimeSlot}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {timeSlots.map(slot => (
                  <div key={slot.id} className="flex items-center gap-2">
                    <input
                      type="date"
                      value={slot.day}
                      onChange={(e) => updateTimeSlot(slot.id, 'day', e.target.value)}
                      className="input-field flex-1"
                    />
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) => updateTimeSlot(slot.id, 'time', e.target.value)}
                      className="input-field w-32"
                    />
                    <button
                      onClick={() => removeTimeSlot(slot.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Time Slot</h3>
              <div className="space-y-2">
                {timeSlots.map(slot => (
                  <label
                    key={slot.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer ${
                      selectedSlot === slot.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-white border border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      checked={selectedSlot === slot.id}
                      onChange={() => setSelectedSlot(slot.id)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span>{slot.day}</span>
                      <Clock className="w-4 h-4 text-slate-600" />
                      <span>{slot.time}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleSchedule}
                disabled={!selectedSlot || !name || !email}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Video className="w-4 h-4" />
                Schedule Meeting
              </button>
            </div>

            <div className="mt-6 bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">What Happens Next?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-blue-700">
                  <Mail className="w-4 h-4" />
                  Confirmation email with Zoom link
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <Calendar className="w-4 h-4" />
                  Calendar invite for selected time
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <Video className="w-4 h-4" />
                  Automatic Zoom meeting setup
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}