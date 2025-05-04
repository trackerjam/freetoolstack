import React, { useState, useEffect } from 'react';
import { Clock, DollarSign } from 'lucide-react';
import ToolHeader from './ToolHeader';

interface MeetingInputs {
  attendees: number;
  avgHourlyRate: number;
  durationHours: number;
  durationMinutes: number;
}

export default function MeetingCostCalculator() {
  const [inputs, setInputs] = useState<MeetingInputs>({
    attendees: 4,
    avgHourlyRate: 50,
    durationHours: 1,
    durationMinutes: 0
  });

  const [cost, setCost] = useState({
    total: 0,
    perPerson: 0,
    timeValue: ''
  });

  useEffect(() => {
    calculateCost();
  }, [inputs]);

  const calculateCost = () => {
    const totalHours = inputs.durationHours + (inputs.durationMinutes / 60);
    const totalCost = inputs.attendees * inputs.avgHourlyRate * totalHours;
    const perPersonCost = totalCost / inputs.attendees;

    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    const timeValue = `${hours}h ${minutes}m`;

    setCost({
      total: totalCost,
      perPerson: perPersonCost,
      timeValue
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Meeting Cost Calculator" 
          description="Track the real cost of meetings"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Attendees
              </label>
              <input
                type="number"
                name="attendees"
                value={inputs.attendees}
                onChange={handleInputChange}
                className="input-field"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Hourly Rate ($)
              </label>
              <input
                type="number"
                name="avgHourlyRate"
                value={inputs.avgHourlyRate}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours
                </label>
                <input
                  type="number"
                  name="durationHours"
                  value={inputs.durationHours}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minutes
                </label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={inputs.durationMinutes}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Meeting Cost Breakdown
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Total Meeting Cost</div>
                  <div className="text-3xl font-bold text-blue-900 flex items-center gap-1">
                    <DollarSign className="w-6 h-6" />
                    {cost.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">Cost per Person</div>
                  <div className="text-2xl font-bold text-blue-900">
                    ${cost.perPerson.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">Total Time Investment</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {cost.timeValue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}