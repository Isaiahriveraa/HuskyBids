import GameCalendar from '../Components/GameCalendar';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800">Total Bets</h2>
          <p className="text-3xl font-bold text-purple-600">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800">Win Rate</h2>
          <p className="text-3xl font-bold text-green-600">68%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800">Rank</h2>
          <p className="text-3xl font-bold text-yellow-600">#12</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>UW vs Oregon - Football</span>
            <span className="text-green-600 font-semibold">Won 50 biscuits</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>UW vs Stanford - Basketball</span>
            <span className="text-red-600 font-semibold">Lost 30 biscuits</span>
          </div>
        </div>
      </div>

      {/* Game Calendar */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Game Calendar</h2>
        <GameCalendar />
      </div>
    </div>
  );
}
