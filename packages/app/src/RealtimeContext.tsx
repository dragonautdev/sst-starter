import mqtt from 'mqtt'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from './AuthContext'
import { queryClient } from './lib/query-client'
import { trpc } from './router'

function createConnection(endpoint: string, authorizer: string, token: string | null) {
  return mqtt.connect(`wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizer}`, {
    username: "",
    manualConnect: true,
    clientId: `client_${uuidv4()}`,
    password: token || '',
    protocolVersion: 5,
  })
}

export interface RealtimeContext {
  isConnected: boolean,
  connection: mqtt.MqttClient | null
}

const RealtimeContext = React.createContext<RealtimeContext | null>(null)

export function RealtimeProvider(props: { children: React.ReactNode }) {
  const { token, loggedIn } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [connection, setConnection] = useState<mqtt.MqttClient | null>(null)

  const user = queryClient.getQueryData(trpc.user.get.queryKey())

  useEffect(() => {
    if (!token || !loggedIn || !user) return

    const client = createConnection(import.meta.env.VITE_REALTIME_NOTIFICATIONS_ENDPOINT, import.meta.env.VITE_REALTIME_NOTIFICATIONS_AUTHORIZER, token)

    client.on('connect', async () => {
      try {
        console.log(`Connecting to REALTIME NOTIFICATIONS`)
        await client.subscribeAsync(`${import.meta.env.VITE_APP}/${import.meta.env.VITE_STAGE}/${user?.userId}/notification`)
        await client.subscribeAsync(`${import.meta.env.VITE_APP}/${import.meta.env.VITE_STAGE}/${user?.userId}/analysis`)
        setConnection(client)
        setIsConnected(true)
        console.log(`Connected to REALTIME NOTIFICATIONS`)
      } catch (error) {
        console.error(`Failed to connect to REALTIME NOTIFICATIONS`, error)
      }
    })

    client.on('error', () => {
    })

    
    client.connect()

    return () => {
      client.end()
      setConnection(null)
    }
  }, [token, loggedIn, setConnection, setIsConnected, user])

  return (
    <RealtimeContext.Provider value={{ isConnected, connection }}>
      {props.children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = React.useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}