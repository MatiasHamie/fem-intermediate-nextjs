'use server'

import { db } from '@/db/db'
import { events } from '@/db/schema'
import { delay } from '@/utils/delay'
import { getCurrentUser } from '@/utils/users'
import randomName from '@scaleway/random-name'
import { revalidateTag } from 'next/cache'

export const createNewEvent = async () => {
  await delay(2000)
  const user = await getCurrentUser()

  await db.insert(events).values({
    startOn: new Date().toUTCString(),
    createdById: user.id,
    isPrivate: false,
    name: randomName('event', ' '),
  })

  // ver ./utils/events.ts
  // en esta funcion de createNewEvent estamos creando un evento nuevo
  // cuando termina de guardarse en la db el nuevo evento, llamamos a revalidateTag
  // para que se revalide la cache de eventos en el dashboard
  // de esta forma, cuando se cree un nuevo evento, se actualizara la lista de eventos
  // caso contrario, tengo q hacer hard reload para que aparezcan los nuevos eventos
  revalidateTag('dashboard:events')
  revalidateTag('events')
}
