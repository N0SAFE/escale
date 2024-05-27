import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateUser as CreateUserType } from '@/types/model/User'
import React from 'react'
import Loader from '@/components/atomics/atoms/Loader'

type CreateUserProps = {
    isLoading?: boolean
    onCreate?: (data?: CreateUserType) => void
}

export function CreateUser({ isLoading, onCreate }: CreateUserProps) {
    const [userState, setUserState] = React.useState<CreateUserType>({
        email: '',
        password: '',
    })
    return (
        <div>
            <div className="grid w-full gap-4 py-4">
                <div className="flex items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Email
                    </Label>
                    <Input
                        id="title"
                        value={userState.email}
                        onChange={(e) =>
                            setUserState({
                                ...userState,
                                email: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Password
                    </Label>
                    <Input
                        id="location"
                        value={userState.password}
                        onChange={(e) =>
                            setUserState({
                                ...userState,
                                password: e.target.value,
                            })
                        }
                    />
                </div>
            </div>
            <Button
                className="relative"
                onClick={() => onCreate?.(userState)}
                disabled={isLoading}
            >
                <span className={isLoading ? 'invisible' : 'visible'}>
                    Save change
                </span>
                {isLoading ? (
                    <div className="absolute flex items-center justify-center">
                        <Loader size={'4'} />
                    </div>
                ) : (
                    ''
                )}
            </Button>
        </div>
    )
}
