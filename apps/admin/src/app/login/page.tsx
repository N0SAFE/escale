'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React, { useEffect } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '@/lib/auth'
import { navigate } from '../actions/navigate'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import dynamic from 'next/dynamic'

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

const pageNoSsr = dynamic(
    () =>
        Promise.resolve(() => {
            const loginMutation = useMutation({
                mutationFn: async (data: z.infer<typeof FormSchema>) =>
                    login(data.email, data.password),
                onError: (error) => {
                    toast.error('server error')
                },
                onSuccess: (session) => {
                    if (!session?.isAuthenticated) {
                        return toast.error('Invalid email or password')
                    }
                    toast.success('Welcome back')
                    navigate(searchParams.get('redirectPath') || '/')
                },
            })
            const searchParams = useSearchParams()

            useEffect(() => {
                if (searchParams.has('error')) {
                    if (searchParams.get('redirectPath') !== '/') {
                        toast.error(searchParams.get('error')!)
                    }
                    const params = new URLSearchParams(searchParams.toString())
                    params.delete('error')
                    navigate('/login?' + params.toString())
                }
            }, [searchParams])

            const form = useForm<z.infer<typeof FormSchema>>({
                resolver: zodResolver(FormSchema),
                defaultValues: {
                    email: '',
                    password: '',
                },
            })

            return (
                <div className="min-h-screen flex">
                    <div className="w-1/2 bg-black text-white p-12 flex-col justify-between hidden md:flex">
                        <div>
                            <GlobeIcon className="text-white w-6 h-6" />
                            <h1 className="text-4xl font-bold mt-4">
                                Acme Inc
                            </h1>
                        </div>
                        <div>
                            <p className="text-xl leading-relaxed">
                                &quot;This library has saved me countless hours
                                of work and helped me deliver stunning designs
                                to my clients faster than ever before.&quot;
                            </p>
                            <p className="text-lg font-semibold mt-4">
                                Sofia Davis
                            </p>
                        </div>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((data) =>
                                loginMutation.mutate(data)
                            )}
                            className="w-screen p-12 flex flex-col justify-center gap-8 md:w-[inherit]"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-6">
                                Sign in to your account
                            </h2>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>email</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="email"
                                                placeholder="name@example.com"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormDescription>
                                            Enter your email address
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="password"
                                                type="password"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormDescription>
                                            Enter your password
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={loginMutation.isPending}
                                type="submit"
                                className="mb-4"
                            >
                                {loginMutation.isPending ? (
                                    <Loader size="4" />
                                ) : (
                                    'Sign In with Email'
                                )}
                            </Button>
                            <p className="text-sm text-gray-500">
                                By clicking continue, you agree to our{' '}
                                <Link className="text-blue-600" href="#">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link className="text-blue-600" href="#">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </form>
                    </Form>
                    {/* <form className="w-1/2 bg-white p-12 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-6">Create an account</h2>
                <p className="text-lg mb-6">Enter your email below to create your account</p>
                <Input className="mb-4" placeholder="name@example.com" type="email" name="email" />
                <Input className="mb-4" placeholder="password" type="password" name="password" />
                <Button className="mb-4">Sign In with Email</Button>
                <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-sm text-gray-500 uppercase px-4">or continue with</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <Button className="mb-4" variant="outline">
          <GithubIcon className="w-6 h-6 mr-2" />
          GitHub{"\n          "}
        </Button> 
                <p className="text-sm text-gray-500">
                    By clicking continue, you agree to our{" "}
                    <Link className="text-blue-600" href="#">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link className="text-blue-600" href="#">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </form> */}
                </div>
            )
        }),
    {
        ssr: false,
    }
)

export default pageNoSsr

// million-ignore
function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    )
}
