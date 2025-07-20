import { useState } from 'react';
import { Zap, TrendingUp, Users, DollarSign, BarChart3, Target, Smartphone, Globe, ArrowRight, Play, CheckCircle, Star, Eye, Clock as Click, Calendar, Settings, Plus, Filter, Download, Share, X } from 'lucide-react';
import { ConnectWalletButton } from './components/ConnectKit';
import { useWriteContract, useSimulateContract } from 'wagmi'
import abi from '../abi/abi.json';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeMetric, setActiveMetric] = useState('impressions');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [simulateArgs, setSimulateArgs] = useState<readonly unknown[] | null>(null)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    metadataURI: '',
    budget: '',
    costPerAction: '',
    costModel: 'CPM',
    startTime: '',
    endTime: ''
  });

  


  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | null

// Optional: convert numeric inputs properly
const parsedBudget = Number(formData.budget || 0);
const parsedCostPerAction = Number(formData.costPerAction || 0);
const parsedStartTime = formData.startTime ? new Date(formData.startTime).getTime() / 1000 : 0;
const parsedEndTime = formData.endTime ? new Date(formData.endTime).getTime() / 1000 : 0;

// const { config } = useWriteContract({
//   // address: `0x${process.env.CONTRACT_ADDRESS}`,
//   abi: abi,
//   functionName: 'feed',
//   enabled: Boolean(formData.metadataURI), // prevent calling too early
//   args: [
//     formData.metadataURI,
//     parsedBudget,
//     parsedCostPerAction,
//     formData.costModel,
//     parsedStartTime,
//     parsedEndTime
//   ]
// });

 
 const {
    data,
    error,
    isPending: isSimulating
  } = useSimulateContract({
    address: '0xC0B08FB1611726A684069D0c878b70CC54e8570C',
    abi,
    functionName: 'createCampaign',
    args: simulateArgs ?? undefined,
    query: {
      enabled: Boolean(formData.metadataURI),
    },
  });

  // ✅ Write contract
  const { writeContractAsync } = useWriteContract();

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const args = [
      formData.metadataURI,
      BigInt(formData.budget),
      BigInt(formData.costPerAction),
      BigInt(formData.costModel),
      BigInt(new Date(formData.startTime).getTime() / 1000),
      BigInt(new Date(formData.endTime).getTime() / 1000),
    ];

    setSimulateArgs(args); // 👈 Trigger simulation only

    setSubmissionStatus('simulating');
  } catch (err) {
    console.error('Failed to prepare simulation args:', err);
    setSubmissionStatus('error');
  }
};




  const mockCampaigns = [
    { id: 1, name: 'TaskFlow Pro', status: 'Active', impressions: 125000, clicks: 3200, spend: 450, revenue: 1250 },
    { id: 2, name: 'CryptoTracker', status: 'Active', impressions: 89000, clicks: 2100, spend: 320, revenue: 890 },
    { id: 3, name: 'FitnessMini', status: 'Paused', impressions: 56000, clicks: 1400, spend: 180, revenue: 420 },
  ];

  const mockPublishers = [
    { id: 1, name: 'GameHub', revenue: 890, impressions: 234000, apps: 12 },
    { id: 2, name: 'NewsApp', revenue: 650, impressions: 178000, apps: 8 },
    { id: 3, name: 'SocialFeed', revenue: 1200, impressions: 345000, apps: 15 },
  ];

  const NavButton = ({ icon: Icon, label, tabKey, isActive }: any) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const MetricCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );

  const CampaignRow = ({ campaign }: any) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Smartphone size={20} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{campaign.name}</p>
            <p className="text-sm text-gray-500">Mini App</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          campaign.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.status}
        </span>
      </td>
      <td className="py-4 px-6 text-gray-900 font-medium">{campaign.impressions.toLocaleString()}</td>
      <td className="py-4 px-6 text-gray-900 font-medium">{campaign.clicks.toLocaleString()}</td>
      <td className="py-4 px-6 text-gray-900 font-medium">${campaign.spend}</td>
      <td className="py-4 px-6 text-green-600 font-bold">${campaign.revenue}</td>
      <td className="py-4 px-6">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View Details
        </button>
      </td>
    </tr>
  );

  const CampaignForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
            <button
              onClick={() => {
                setShowCampaignForm(false);
                setSubmissionStatus(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submissionStatus === 'success' && (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md">
              ✅ Campaign successfully created!
            </div>
          )}
          {submissionStatus === 'error' && (
            <div className="bg-red-100 text-red-800 px-4 py-3 rounded-md">
              ❌ Failed to create campaign. Please try again.
            </div>
          )}
          {error && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md">
              ⚠️ Simulation failed: {error.message}
            </div>
          )}

          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AD URI</label>
            <input
              type="url"
              value={formData.metadataURI}
              onChange={(e) => setFormData({ ...formData, metadataURI: e.target.value })}
              placeholder="https://example.com/metadata.json"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Per Action ($)</label>
              <input
                type="number"
                value={formData.costPerAction}
                onChange={(e) => setFormData({ ...formData, costPerAction: e.target.value })}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Model</label>
  <select
    value={formData.costModel}
    onChange={(e) => setFormData({ ...formData, costModel: Number(e.target.value) })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
  >
    <option value={1}>CPM</option>
    <option value={2}>CPC</option>
  </select>
</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowCampaignForm(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!data?.request || isSimulating}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium"
            >
              {isSimulating ? 'Preparing...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AdChainly
                </span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
                <a href="#publishers" className="text-gray-600 hover:text-gray-900 font-medium">Publishers</a>
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
                <a href="#publishers" className="text-gray-600 hover:text-gray-900 font-medium">Campaigns</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>

                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Launch Dashboard
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Boost Your Mini App's 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Visibility</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with the largest network of mini app publishers. Promote your app across thousands of platforms 
              with intelligent targeting and revenue sharing that benefits everyone.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Start Promoting <ArrowRight size={20} />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all flex items-center gap-2">
                <Play size={20} /> Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">50M+</div>
                <div className="text-gray-600">Monthly Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
                <div className="text-gray-600">Publisher Apps</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Revenue Share</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">24h</div>
                <div className="text-gray-600">Campaign Approval</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools and insights to maximize your mini app's reach and revenue
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Target size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Targeting</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered audience targeting based on user behavior, demographics, and app usage patterns for maximum engagement.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Warpcast Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Native integration with Warpcast metrics for comprehensive performance tracking and optimization insights.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Revenue Sharing</h3>
              <p className="text-gray-600 leading-relaxed">
                Fair revenue distribution with publishers earning up to 70% of ad revenue, creating a sustainable ecosystem.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Globe size={24} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to thousands of high-quality publisher apps across different categories and geographic regions.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatic campaign optimization using machine learning to improve performance and reduce costs.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Users size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Audience</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with engaged users who are more likely to install and actively use your mini app.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Scale Your Mini App?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of developers already growing their audience with AdChainly
            </p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
            >
              Get Started Today
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold">AdChainly</span>
              </div>
              <div className="text-gray-400">
                © 2025 AdChainly. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AdChainly
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('home')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Home
              </button>

              {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div> */}
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-xl shadow-md p-6 h-fit">
          <nav className="space-y-2">
            <NavButton icon={BarChart3} label="Dashboard" tabKey="dashboard" isActive={activeTab === 'dashboard'} />
            <NavButton icon={Target} label="Campaigns" tabKey="campaigns" isActive={activeTab === 'campaigns'} />
            <NavButton icon={Globe} label="Publishers" tabKey="publishers" isActive={activeTab === 'publishers'} />
            <NavButton icon={TrendingUp} label="Analytics" tabKey="analytics" isActive={activeTab === 'analytics'} />
            <NavButton icon={DollarSign} label="Revenue" tabKey="revenue" isActive={activeTab === 'revenue'} />
            <NavButton icon={Settings} label="Settings" tabKey="settings" isActive={activeTab === 'settings'} />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 mt-1">Overview of your advertising performance</p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus size={20} />
                  <span onClick={() => setShowCampaignForm(true)}>New Campaign</span>
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-6">
                <MetricCard 
                  icon={Eye} 
                  title="Total Impressions" 
                  value="2.4M" 
                  change={12.5} 
                  color="bg-blue-500" 
                />
                <MetricCard 
                  icon={Click} 
                  title="Total Clicks" 
                  value="64.2K" 
                  change={8.3} 
                  color="bg-green-500" 
                />
                <MetricCard 
                  icon={DollarSign} 
                  title="Total Spend" 
                  value="$3,240" 
                  change={-2.1} 
                  color="bg-purple-500" 
                />
                <MetricCard 
                  icon={TrendingUp} 
                  title="Revenue Generated" 
                  value="$8,950" 
                  change={18.7} 
                  color="bg-orange-500" 
                />
              </div>

              {/* Recent Campaigns */}
              <div className="bg-white rounded-xl shadow-md">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Recent Campaigns</h2>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCampaigns.map((campaign) => (
                        <CampaignRow key={campaign.id} campaign={campaign} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-gray-600 mt-1">Performance insights with Warpcast integration</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Calendar size={16} />
                    Last 30 days
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              {/* Metric Selector */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setActiveMetric('impressions')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeMetric === 'impressions' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Impressions
                  </button>
                  <button 
                    onClick={() => setActiveMetric('clicks')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeMetric === 'clicks' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Clicks
                  </button>
                  <button 
                    onClick={() => setActiveMetric('revenue')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeMetric === 'revenue' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Revenue
                  </button>
                  <button 
                    onClick={() => setActiveMetric('warpcast')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeMetric === 'warpcast' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Warpcast Metrics
                  </button>
                </div>

                {/* Chart Placeholder */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-blue-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">
                      {activeMetric === 'warpcast' ? 'Warpcast Integration Analytics' : `${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Chart`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Real-time data visualization</p>
                  </div>
                </div>
              </div>

              {/* Warpcast Integration */}
              {activeMetric === 'warpcast' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Farcaster Engagement</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Cast Interactions</span>
                        <span className="font-bold text-purple-600">1,234</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Channel Mentions</span>
                        <span className="font-bold text-purple-600">456</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Frame Clicks</span>
                        <span className="font-bold text-purple-600">2,890</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">/degen</span>
                        <span className="font-bold text-green-600">+24%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">/base</span>
                        <span className="font-bold text-green-600">+18%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">/programming</span>
                        <span className="font-bold text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'publishers' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Publisher Network</h1>
                  <p className="text-gray-600 mt-1">Apps displaying your advertisements</p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
                  <Share size={20} />
                  Invite Publishers
                </button>
              </div>

              {/* Publisher Grid */}
              <div className="grid grid-cols-3 gap-6">
                {mockPublishers.map((publisher) => (
                  <div key={publisher.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Globe size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{publisher.name}</h3>
                        <p className="text-sm text-gray-500">{publisher.apps} active apps</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Revenue Share</span>
                        <span className="font-bold text-green-600">${publisher.revenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Impressions</span>
                        <span className="font-medium text-gray-900">{publisher.impressions.toLocaleString()}</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Revenue Sharing</h1>
                <p className="text-gray-600 mt-1">Transparent revenue distribution with your publisher network</p>
              </div>

              {/* Revenue Overview */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign size={20} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Total Revenue</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">$12,840</p>
                  <p className="text-sm text-gray-500">+23% vs last month</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Publisher Share</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">$8,988</p>
                  <p className="text-sm text-gray-500">70% revenue share</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={20} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Your Share</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-2">$3,852</p>
                  <p className="text-sm text-gray-500">30% platform fee</p>
                </div>
              </div>

              {/* Revenue Calculator */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Calculator</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Budget</label>
                    <input 
                      type="number" 
                      placeholder="1000" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected CTR (%)</label>
                    <input 
                      type="number" 
                      placeholder="2.5" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Impressions</p>
                      <p className="text-xl font-bold text-gray-900">400,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Publisher Revenue</p>
                      <p className="text-xl font-bold text-green-600">$700</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Your Investment</p>
                      <p className="text-xl font-bold text-purple-600">$1,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Form Popup */}
          {showCampaignForm && <CampaignForm />}
        </div>
      </div>
    </div>
  );
}

export default App;