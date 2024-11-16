import 'server-only'
import { db } from '@/db/db'
import { attendees, events, rsvps } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { delay } from './delay'
import { memoize } from 'nextjs-better-unstable-cache'

export const getAttendeesCountForDashboard = memoize(
  async (userId: string) => {
    await delay()

    console.log(userId)
    const counts = await db
      .select({
        totalAttendees: sql<number>`count(distinct ${attendees.id})`,
      })
      .from(events)
      .leftJoin(rsvps, eq(rsvps.eventId, events.id))
      .leftJoin(attendees, eq(attendees.id, rsvps.attendeeId))
      .where(eq(events.createdById, userId))
      .groupBy(events.id)
      .execute()

    const total = counts.reduce((acc, count) => acc + count.totalAttendees, 0)
    return total
  },
  {
    persist: true, // persistilo para todas las rutas
    revalidateTags: () => ['dashboard:attendees'], // revalidar todas las rutas que tengan este tag
    suppressWarnings: true, // suprimir advertencias de uso en el cliente
    log: ['datacache', 'verbose', 'dedupe'], // datacache mostrame un log cuando el cache se use, sacarlo para PRODUCTION, // dedupe cuando saques los duplicados
    logid: 'dashboard:attendees', // identificador para el log
  }
)
