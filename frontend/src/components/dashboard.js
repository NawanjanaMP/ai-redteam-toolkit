// AI Red-Teaming Toolkit - Main Dashboard Component
// File: frontend/src/components/Dashboard/AIRedTeamDashboard.jsx

import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity, Target, Zap, FileText, TrendingUp, CheckCircle, Clock, BarChart3 } from 'lucide-react';

const AIRedTeamDashboard = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('test');
  const [stats, setStats] = useState({ total_tests: 0, average_risk_score: 0, total_vulnerabilities: 0 });
  
  const [formData, setFormData] = useState({
    target_prompt: 'You are a helpful AI assistant. Please help users with their questions.',
    attack_types: ['prompt_injection', 'jailbreak'],
    intensity: 'medium'
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Call actual FastAPI backend
  const runSecurityTest = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setTestResults(result);
      
      // Update stats
      setStats(prev => ({
        total_tests: prev.total_tests + 1,
        average_risk_score: ((prev.average_risk_score * prev.total_tests) + result.risk_score) / (prev.total_tests + 1),
        total_vulnerabilities: prev.total_vulnerabilities + result.vulnerabilities_found.length
      }));
      
      setActiveTab('results');
    } catch (error) {
      console.error('Test failed:', error);
      alert('Failed to run security test. Make sure the backend is running on ' + API_BASE_URL);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      attack_types: prev.attack_types.includes(value)
        ? prev.attack_types.filter(t => t !== value)
        : [...prev.attack_types, value]
    }));
  };

  const getRiskColor = (score) => {
    if (score >= 75) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Red-Teaming Toolkit
            </h1>
          </div>
          <p className="text-slate-400 ml-13">Production-ready security testing suite for LLM systems</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Tests</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.total_tests}</p>
              </div>
              <Activity className="w-8 h-8 text-cyan-400/50" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Risk Score</p>
                <p className="text-2xl font-bold text-orange-400">{stats.average_risk_score.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400/50" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Vulnerabilities</p>
                <p className="text-2xl font-bold text-red-400">{stats.total_vulnerabilities}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400/50" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {testResults ? ((testResults.successful_attacks / testResults.total_attacks) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-400/50" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'test'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Run Test
            </div>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'results'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
            disabled={!testResults}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Results
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </div>
          </button>
        </div>

        {/* Test Configuration */}
        {activeTab === 'test' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Security Test Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Prompt</label>
                <textarea
                  value={formData.target_prompt}
                  onChange={(e) => setFormData({ ...formData, target_prompt: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  rows={4}
                  placeholder="Enter the AI prompt or system message to test..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attack Types</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'prompt_injection', label: 'Prompt Injection', icon: '🎯' },
                    { id: 'jailbreak', label: 'Jailbreak', icon: '🔓' },
                    { id: 'toxic_output', label: 'Toxic Output', icon: '☠️' },
                    { id: 'behavior_fuzzing', label: 'Behavior Fuzzing', icon: '🎲' }
                  ].map(attack => (
                    <label key={attack.id} className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-600 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.attack_types.includes(attack.id)}
                        onChange={() => handleCheckboxChange(attack.id)}
                        className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-600 rounded focus:ring-cyan-400"
                      />
                      <span>{attack.icon} {attack.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Intensity Level</label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, intensity: level })}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        formData.intensity === level
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={runSecurityTest}
                disabled={loading || formData.attack_types.length === 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running Security Tests...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Launch Red Team Attack
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && testResults && (
          <div className="space-y-6">
            {/* Risk Score Card */}
            <div className={`border rounded-xl p-6 ${getRiskColor(testResults.risk_score)}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Overall Risk Score</h2>
                <div className="text-5xl font-bold">{testResults.risk_score.toFixed(1)}</div>
              </div>
              <div className="w-full bg-white/30 rounded-full h-4">
                <div
                  className="bg-current h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${testResults.risk_score}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="opacity-75">Total Attacks</p>
                  <p className="text-xl font-bold">{testResults.total_attacks}</p>
                </div>
                <div>
                  <p className="opacity-75">Successful</p>
                  <p className="text-xl font-bold">{testResults.successful_attacks}</p>
                </div>
                <div>
                  <p className="opacity-75">Success Rate</p>
                  <p className="text-xl font-bold">
                    {((testResults.successful_attacks / testResults.total_attacks) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Vulnerabilities */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Detected Vulnerabilities ({testResults.vulnerabilities_found.length})
              </h2>
              <div className="space-y-3">
                {testResults.vulnerabilities_found.map((vuln, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-sm">{vuln.attack_type.replace('_', ' ')}</span>
                      </div>
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {vuln.response_time_ms.toFixed(1)}ms
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 font-mono bg-slate-800 p-2 rounded">
                      {vuln.payload}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Detection Score: {(vuln.detection_score * 100).toFixed(0)}%</span>
                      <span>Attack ID: {vuln.attack_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Security Recommendations
              </h2>
              <ul className="space-y-2">
                {testResults.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <span className="text-cyan-400 mt-1">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Analytics Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-slate-300">Attack Type Distribution</h3>
                <div className="space-y-2">
                  {testResults?.vulnerabilities_found && (
                    <>
                      {['prompt_injection', 'jailbreak', 'toxic_output', 'behavior_fuzzing'].map(type => {
                        const count = testResults.vulnerabilities_found.filter(v => v.attack_type === type).length;
                        const percentage = testResults.vulnerabilities_found.length > 0 
                          ? (count / testResults.vulnerabilities_found.length) * 100 
                          : 0;
                        return (
                          <div key={type}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">{type.replace('_', ' ')}</span>
                              <span className="text-cyan-400">{count}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-cyan-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-slate-300">Severity Breakdown</h3>
                <div className="space-y-2">
                  {testResults?.vulnerabilities_found && (
                    <>
                      {['critical', 'high', 'medium', 'low'].map(severity => {
                        const count = testResults.vulnerabilities_found.filter(v => v.severity === severity).length;
                        return (
                          <div key={severity} className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${getSeverityColor(severity)}`}>
                              {severity.toUpperCase()}
                            </span>
                            <span className="text-xl font-bold text-slate-300">{count}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRedTeamDashboard;