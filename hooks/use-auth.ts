import useSWR from 'swr'
import { http } from '@/services/instance'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TGuest } from '@/services/order'
import { TCartItem } from './use-cart'
import { ProductReview } from '@/services/product-reviews/product-review'

interface AuthProps {
  middleware?: 'auth' | 'guest'
  redirectIfAuthenticated?: string
}

export interface AuthErrors {
  [key: string]: string[]
}

export interface TUser {
  id?: number;
  name?: string;
  email: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  guest?: TGuest;
  carts?: TCartItem[];
  reviews?: ProductReview[];
}

interface AuthFunctions extends TUser {
  setErrors: (errors: AuthErrors) => void
  setStatus?: (status: string | null) => void
  password: string
  password_confirmation?: string
  remember?: boolean
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthProps = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        http
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response?.status !== 409) throw error

                router.push('/verify-email')
            }),
            {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    )

    const csrf = () => http.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: AuthFunctions) => {
        await csrf()

        setErrors({})

        http
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: AuthFunctions) => {
        await csrf()

        setErrors({})
        if (setStatus) setStatus(null)

        http
            .post(`login`, props)
            .then(() => mutate())
            .catch(error => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }: AuthFunctions) => {
        await csrf()

        setErrors({})
        if (setStatus) setStatus(null)

        http
            .post('forgot-password', { email })
            .then(response => setStatus?.(response.data.status))
            .catch(error => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }: AuthFunctions) => {
        await csrf()

        setErrors({})
        if (setStatus) setStatus(null)

        http
            .post('reset-password', { token: params?.token as string, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = async ({ setStatus }: { setStatus: (status: string) => void }) => {
        http
            .post('email/verification-notification')
            .then(response => setStatus(response.data.status))
            .catch(error => {
                throw error
            })
    }

    const logout = async () => {
        if (!error) {
            await http.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && user?.email_verified_at === null)
            router.push('/verify-email')
        
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated as string)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
