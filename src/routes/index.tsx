import { useStore } from '@/hooks'
import { supabase } from '@/supabaseClient'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { login } = useStore(useShallow((s) => ({ login: s.login })))

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // handle sign out event
        router.navigate({ to: '/login', replace: true })
      } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
        router.navigate({ to: '/update-password', replace: true })
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
      }
      if (event === 'INITIAL_SESSION') {
        // handle initial session
        if (!session) {
          router.navigate({ to: '/login', replace: true })
        } else {
          login()
          // router.navigate({ to: "/home", replace: true });
        }
      }
      if (event === 'SIGNED_IN') {
        // handle sign in event
        if (!router.matchRoute('/update-password')) {
          // if user is already on the update-password route, don't navigate again
          return
        } else {
          login()
          router.navigate({ to: '/home', replace: true })
        }
      }
    })

    return () => {
      // call unsubscribe to remove the callback
      data.subscription.unsubscribe()
    }
  }, [])
  return <Outlet />
}
