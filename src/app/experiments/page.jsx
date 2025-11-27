'use client';

import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Calendar, MoreHorizontal, Flame, Users, Activity } from 'lucide-react';
import BiscuitIcon from '../../components/BiscuitIcon';

export default function ExperimentsPage() {
  const recentActivity = [
    {
      id: 1,
      matchup: 'UW @ Oregon',
      market: 'Moneyline • Live boost',
      result: 'Won',
      biscuits: '+760',
      timestamp: '12m ago',
      confidence: 94,
      edge: '+5.2% edge',
      note: 'Late QB injury alert capitalized'
    },
    {
      id: 2,
      matchup: 'Kraken vs Knights',
      market: 'Puck line -1.5',
      result: 'Lost',
      biscuits: '-200',
      timestamp: '1h ago',
      confidence: 71,
      edge: '-1.1% edge',
      note: 'OT collapse swung cover'
    },
    {
      id: 3,
      matchup: 'Seahawks vs 49ers',
      market: 'Total over 47.5',
      result: 'Won',
      biscuits: '+320',
      timestamp: '3h ago',
      confidence: 88,
      edge: '+2.7% edge',
      note: 'Weather models confirmed clear skies'
    }
  ];

  const trendingBets = [
    {
      id: 1,
      league: 'NFL',
      title: 'Seahawks win by 7+',
      odds: '+250',
      volume: '1.8k slips',
      trend: '+42% today',
      contributors: 48,
      timeLeft: '5m',
      signal: 'Sharp money leaning Seahawks'
    },
    {
      id: 2,
      league: 'NHL',
      title: 'Kraken under 5.5 goals',
      odds: '-110',
      volume: '980 slips',
      trend: '+18% today',
      contributors: 21,
      timeLeft: '27m',
      signal: 'Steam move hit the under twice'
    },
    {
      id: 3,
      league: 'CFB',
      title: 'UW first half ML',
      odds: '-145',
      volume: '2.3k slips',
      trend: '+57% today',
      contributors: 63,
      timeLeft: '2h',
      signal: 'Model edge vs. market line'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Matchup Card */}
        <div 
          className="lg:col-span-3 rounded-3xl p-1 relative overflow-hidden shadow-2xl shadow-purple-900/20 group"
          style={{ background: 'linear-gradient(to right, #0f172a, rgba(75, 46, 131, 0.9), #0f172a)' }}
        >
          {/* Animated Border Gradient */}
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-gradient-x"
            style={{ background: 'linear-gradient(to right, #E8D21D, #a855f7, #E8D21D)' }}
          ></div>
          
          <div className="relative bg-slate-950 rounded-[22px] p-6 md:p-8 h-full overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(75, 46, 131, 0.2)' }}></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(232, 210, 29, 0.1)' }}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Left: Game Info */}
              <div className="text-center md:text-left">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ backgroundColor: 'rgba(232, 210, 29, 0.1)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(232, 210, 29, 0.2)', color: '#E8D21D' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  GAME OF THE WEEK
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                  Apple Cup 2025
                </h1>
                <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2">
                  <Calendar size={16} /> Nov 29 • 4:00 PM
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  <span style={{ color: '#B39DDB' }}>Husky Stadium</span>
                </p>
              </div>

              {/* Center: Matchup Visual */}
              <div className="flex items-center gap-4 md:gap-8">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full p-4 shadow-lg shadow-purple-500/20 ring-4 ring-slate-800">
                    <img src="https://a.espncdn.com/i/teamlogos/ncaa/500/264.png" alt="Washington" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-lg">Huskies</span>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-black text-slate-700 italic">VS</span>
                  <div className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400">
                    ODDS
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full p-4 shadow-lg shadow-green-500/20 ring-4 ring-slate-800">
                    <img src="https://a.espncdn.com/i/teamlogos/ncaa/500/265.png" alt="Washington State" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-lg">Cougars</span>
                </div>
              </div>

              {/* Right: Action */}
              <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-sm text-slate-400">Moneyline</span>
                  <span className="font-bold" style={{ color: '#E8D21D' }}>+150</span>
                </div>
                <button 
                  className="w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#4B2E83', boxShadow: '0 10px 15px -3px rgba(75, 46, 131, 0.25)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4B2E83'}
                >
                  Place Bet <ArrowUpRight size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Live Games Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-8 rounded-full" style={{ backgroundColor: '#E8D21D' }}></span>
            Live & Upcoming
          </h2>
          <button className="hover:text-white text-sm font-medium transition-colors" style={{ color: '#B39DDB' }}>View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Game Card 1 */}
          <GameCard 
            team1="Huskies" 
            team1Logo="https://a.espncdn.com/i/teamlogos/ncaa/500/264.png"
            team1Score="24" 
            team2="Ducks" 
            team2Logo="https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png"
            team2Score="21" 
            time="Q3 12:45" 
            isLive={true}
            odds="+150"
          />
          {/* Game Card 2 */}
          <GameCard 
            team1="Seahawks" 
            team1Logo="https://a.espncdn.com/i/teamlogos/nfl/500/sea.png"
            team1Score="-" 
            team2="49ers" 
            team2Logo="https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"
            team2Score="-" 
            time="Tomorrow, 5:30 PM" 
            isLive={false}
            odds="-110"
          />
           {/* Game Card 3 */}
           <GameCard 
            team1="Kraken" 
            team1Logo="https://a.espncdn.com/i/teamlogos/nhl/500/sea.png"
            team1Score="2" 
            team2="Golden Knights" 
            team2Logo="https://a.espncdn.com/i/teamlogos/nhl/500/vgs.png"
            team2Score="2" 
            time="OT 3:12" 
            isLive={true}
            odds="+200"
          />
        </div>
      </div>

      {/* Stats & Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <section className="lg:col-span-2 space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4B2E83, #7c3aed)' }}>
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Today's Action</h3>
                <p className="text-xs text-slate-500">Your recent plays</p>
              </div>
            </div>
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all flex items-center gap-1.5">
              Export <MoreHorizontal size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item) => {
              const isWin = item.result === 'Won';
              return (
                <article
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 group cursor-pointer"
                  style={{ 
                    background: 'linear-gradient(to bottom right, #0f172a, #020617)',
                    borderColor: 'rgba(30, 41, 59, 0.5)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(75, 46, 131, 0.6)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.5)'}
                >
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at top left, rgba(75, 46, 131, 0.15), transparent 50%)' }}
                  />
                  
                  <div className="relative flex items-center gap-4">
                    {/* Result indicator */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: isWin 
                          ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(34, 197, 94, 0.1))' 
                          : 'linear-gradient(135deg, rgba(251, 113, 133, 0.15), rgba(239, 68, 68, 0.1))',
                        border: isWin ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(251, 113, 133, 0.3)'
                      }}
                    >
                      {isWin ? (
                        <ArrowUpRight size={22} style={{ color: '#34d399' }} />
                      ) : (
                        <ArrowDownRight size={22} style={{ color: '#fb7185' }} />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{item.matchup}</h4>
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{ 
                            background: isWin ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                            color: isWin ? '#6ee7b7' : '#fda4af'
                          }}
                        >
                          {item.result}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{item.market}</p>
                    </div>
                    
                    {/* Payout */}
                    <div className="text-right flex-shrink-0">
                      <div 
                        className="text-lg font-bold flex items-center gap-1 justify-end"
                        style={{ color: isWin ? '#34d399' : '#fb7185' }}
                      >
                        <BiscuitIcon size={16} />
                        {item.biscuits}
                      </div>
                      <span className="text-[11px] text-slate-500">{item.timestamp}</span>
                    </div>
                  </div>
                  
                  {/* Confidence bar */}
                  <div className="mt-3 pt-3 border-t border-slate-800/50">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500">{item.edge}</span>
                      <div className="flex-1 h-1 rounded-full bg-slate-800/80 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${item.confidence}%`,
                            background: isWin 
                              ? 'linear-gradient(to right, #34d399, #22c55e)' 
                              : 'linear-gradient(to right, #fb7185, #ef4444)'
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">{item.confidence}%</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Trending */}
        <section className="space-y-5">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8D21D, #f59e0b)' }}>
              <Flame size={20} className="text-slate-900" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hot Right Now</h3>
              <p className="text-xs text-slate-500">Trending plays</p>
            </div>
          </div>

          <div className="space-y-3">
            {trendingBets.map((bet) => (
              <article
                key={bet.id}
                className="rounded-2xl border p-4 transition-all duration-200 group cursor-pointer"
                style={{ 
                  background: 'linear-gradient(to bottom right, #0f172a, #020617)',
                  borderColor: 'rgba(30, 41, 59, 0.5)'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(232, 210, 29, 0.4)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.5)'}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ background: 'rgba(75, 46, 131, 0.3)', color: '#c4b5fd' }}
                      >
                        {bet.league}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock size={10} /> {bet.timeLeft}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white text-sm">{bet.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{bet.signal}</p>
                  </div>
                  <div 
                    className="text-xl font-bold px-3 py-1 rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(232, 210, 29, 0.1)', color: '#E8D21D' }}
                  >
                    {bet.odds}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {Array.from({ length: Math.min(bet.contributors, 4) }).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-slate-900"
                          style={{
                            background: idx === 0 ? 'linear-gradient(135deg,#d4a373,#fbcfe8)' : 'linear-gradient(135deg,#4b2e83,#7c3aed)'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500">{bet.volume}</span>
                  </div>
                  <span 
                    className="text-[11px] px-2 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' }}
                  >
                    {bet.trend}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function GameCard({ team1, team1Logo, team1Score, team2, team2Logo, team2Score, time, isLive, odds }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 hover:bg-slate-900 transition-all duration-200 group cursor-pointer">
      {/* Header: Status & Time */}
      <div className="flex items-center justify-between mb-4">
        {isLive ? (
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            LIVE
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-medium">Upcoming</div>
        )}
        <div className="text-xs text-slate-400 font-mono">{time}</div>
      </div>

      {/* Teams Row */}
      <div className="flex items-center gap-3">
        {/* Team 1 */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex-shrink-0">
            <img src={team1Logo} alt={team1} className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-white truncate">{team1}</div>
            {isLive && <div className="text-lg font-bold text-white">{team1Score}</div>}
          </div>
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-[10px] text-slate-600 font-medium">VS</span>
        </div>

        {/* Team 2 */}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end text-right">
          <div className="min-w-0">
            <div className="font-semibold text-sm text-white truncate">{team2}</div>
            {isLive && <div className="text-lg font-bold text-white">{team2Score}</div>}
          </div>
          <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex-shrink-0">
            <img src={team2Logo} alt={team2} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Odds Button */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 py-2.5 bg-slate-800/50 hover:bg-uw-purple text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group-hover:bg-uw-purple">
          <span className="text-slate-400 group-hover:text-white text-xs">Bet</span>
          <span className="font-bold text-uw-gold group-hover:text-white">{odds}</span>
        </button>
      </div>
    </div>
  );
}
