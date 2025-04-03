import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator } from 'lucide-react';

interface RateInputs {
  annualSalary: number;
  expenses: number;
  nonBillablePercent: number;
  workHoursYear: number;
  taxRate: number;
}

export default function HourlyRateCalculator() {
  const [inputs, setInputs] = useState<RateInputs>({
    annualSalary: 75000,
    expenses: 12000,
    nonBillablePercent: 30,
    workHoursYear: 2080,
    taxRate: 30
  });

  const [rate, setRate] = useState({
    hourly: 0,
    monthly: 0,
    effectiveHours: 0
  });

  useEffect(() => {
    calculateRate();
  }, [inputs]);

  const calculateRate = () => {
    const totalNeeded = inputs.annualSalary * (1 + inputs.taxRate / 100) + inputs.expenses;
    const effectiveHours = inputs.workHoursYear * (1 - inputs.nonBillablePercent / 100);
    const hourlyRate = Math.ceil(totalNeeded / effectiveHours);
    const monthlyRevenue = hourlyRate * effectiveHours / 12;

    setRate({
      hourly: hourlyRate,
      monthly: monthlyRevenue,
      effectiveHours
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Hourly Rate Calculator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Annual Take-Home Salary ($)
              </label>
              <input
                type="number"
                name="annualSalary"
                value={inputs.annualSalary}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Business Expenses ($)
              </label>
              <input
                type="number"
                name="expenses"
                value={inputs.expenses}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Non-Billable Time (%)
              </label>
              <input
                type="number"
                name="nonBillablePercent"
                value={inputs.nonBillablePercent}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Work Hours per Year
              </label>
              <input
                type="number"
                name="workHoursYear"
                value={inputs.workHoursYear}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={inputs.taxRate}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculation Results
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Minimum Hourly Rate</div>
                  <div className="text-3xl font-bold text-blue-900 flex items-center gap-1">
                    <DollarSign className="w-6 h-6" />
                    {rate.hourly}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">Monthly Revenue Target</div>
                  <div className="text-2xl font-bold text-blue-900">
                    ${rate.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">Effective Billable Hours/Year</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {rate.effectiveHours.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  Include software, insurance, and equipment costs in expenses
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  Account for vacation time in yearly work hours
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  Consider market rates in your area
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}