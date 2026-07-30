import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 1. Limpiar datos anteriores para evitar duplicados si recargas la página
    await prisma.gameStat.deleteMany()
    await prisma.game.deleteMany()
    await prisma.teamPlayer.deleteMany()
    await prisma.player.deleteMany()
    await prisma.team.deleteMany()
    await prisma.tournament.deleteMany()

    // 2. Crear el Torneo
    const tournament = await prisma.tournament.create({
      data: { name: 'LIBALNNA - Torneo Inaugural' }
    })

    // 3. Crear los Equipos
    const teamA = await prisma.team.create({
      data: { name: 'Selección U11', category: 'U11', tournamentId: tournament.id }
    })
    
    const teamB = await prisma.team.create({
      data: { name: 'Academia Barquisimeto', category: 'U11', tournamentId: tournament.id }
    })

    // 4. Crear Jugadores y asignarlos al Roster
    const player1 = await prisma.player.create({ data: { name: 'Carlos Pérez' } })
    await prisma.teamPlayer.create({ data: { teamId: teamA.id, playerId: player1.id, number: 10 } })

    const player2 = await prisma.player.create({ data: { name: 'Luis Mendoza' } })
    await prisma.teamPlayer.create({ data: { teamId: teamA.id, playerId: player2.id, number: 23 } })

    const player3 = await prisma.player.create({ data: { name: 'Miguel Torres' } })
    await prisma.teamPlayer.create({ data: { teamId: teamB.id, playerId: player3.id, number: 7 } })

    // 5. Crear el Partido
    const game = await prisma.game.create({
      data: {
        tournamentId: tournament.id,
        homeTeamId: teamA.id,
        awayTeamId: teamB.id,
        date: '2026-08-01',
        time: '09:30 AM',
        venue: 'Cancha Principal',
        status: 'SCHEDULED',
        stage: 'JORNADA INAUGURAL'
      }
    })

    return NextResponse.json({ 
      message: '¡Base de datos alimentada con éxito!', 
      game 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}