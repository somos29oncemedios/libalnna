import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  // Buscamos el partido y traemos todas sus relaciones (Torneo, Equipos, Jugadores)
  const game = await prisma.game.findFirst({
    include: {
      tournament: true,
      homeTeam: { include: { roster: { include: { player: true } } } },
      awayTeam: { include: { roster: { include: { player: true } } } },
    }
  })

  // Si la base de datos está vacía, mostramos este mensaje
  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-400">No hay partidos programados.</h1>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ENCABEZADO DEL TORNEO */}
        <div className="text-center space-y-2 mt-8">
          <h1 className="text-3xl font-extrabold text-slate-800">{game.tournament.name}</h1>
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">{game.stage}</p>
        </div>

        {/* MARCADOR PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          {/* Detalles de fecha y lugar */}
          <div className="bg-slate-900 text-white text-center py-3 text-sm font-medium tracking-wide">
            📅 {game.date} • ⏰ {game.time} • 📍 {game.venue}
          </div>

          {/* Equipos y Resultado */}
          <div className="flex justify-between items-center p-6 md:p-10">
            
            {/* Equipo Local */}
            <div className="text-center flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{game.homeTeam.name}</h2>
              <p className="text-sm text-slate-500 font-medium">Cat: {game.homeTeam.category}</p>
              <div className="text-7xl font-black text-blue-600 mt-4">{game.homeScore}</div>
            </div>

            {/* VS y Status */}
            <div className="px-2 md:px-6 text-center flex flex-col items-center">
              <span className="bg-slate-100 text-slate-400 font-black px-4 py-2 rounded-full text-sm">VS</span>
              <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-wider">{game.status}</p>
            </div>

            {/* Equipo Visitante */}
            <div className="text-center flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{game.awayTeam.name}</h2>
              <p className="text-sm text-slate-500 font-medium">Cat: {game.awayTeam.category}</p>
              <div className="text-7xl font-black text-red-600 mt-4">{game.awayScore}</div>
            </div>
            
          </div>
        </div>

        {/* ROSTERS (Alineaciones) */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Roster Local */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 border-t-4 border-t-blue-500">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Roster: {game.homeTeam.name}
            </h3>
            <ul className="space-y-3">
              {game.homeTeam.roster.map((tp: any) => (
                <li key={tp.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <span className="font-semibold text-slate-700">{tp.player.name}</span>
                  <span className="bg-blue-100 text-blue-800 font-black w-9 h-9 flex items-center justify-center rounded-full text-sm">
                    #{tp.number}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Roster Visitante */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 border-t-4 border-t-red-500">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Roster: {game.awayTeam.name}
            </h3>
            <ul className="space-y-3">
              {game.awayTeam.roster.map((tp: any) => (
                <li key={tp.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <span className="font-semibold text-slate-700">{tp.player.name}</span>
                  <span className="bg-red-100 text-red-800 font-black w-9 h-9 flex items-center justify-center rounded-full text-sm">
                    #{tp.number}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </main>
  )
}