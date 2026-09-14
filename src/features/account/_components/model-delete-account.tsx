"use client"
import { Button } from '@/src/shared/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/shared/components/ui/dialog'
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react'
import { useRemoveAccount } from '../hooks/use-account'
import { toast } from 'sonner'
import { signOut } from 'next-auth/react'

const ModelDeleteAccount = () => {
    const { mutate, isPending } = useRemoveAccount()

    const handelRemoveAccount = () => {
        mutate(undefined, {
            onSuccess: () => {
                toast.success("Account deleted successfully")
                signOut({callbackUrl : "/auth/login"})
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to delete account")
            }
        })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='flex-1 bg-destructive/10 text-destructive' variant="outline">Delete My Account</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl flex justify-center items-center flex-col">

                <div className="size-27.5 bg-destructive/10 rounded-full flex justify-center items-center">
                    <div className="size-20 bg-destructive/5 rounded-full flex justify-center items-center" >
                        <TriangleAlertIcon className='size-12.5 text-destructive' />
                    </div>
                </div>

                <h6 className='text-destructive text-lg font-medium'>Are you sure you want to delete your account?</h6>
                <p className='text-muted-foreground text-sm'>This action is permanent and cannot be undone.</p>


                <DialogFooter className='w-full flex !justify-center items-center'>
                    <DialogClose className='flex-1' asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handelRemoveAccount} disabled={isPending} className='flex-1 bg-destructive' type="submit">
                        {isPending ? <>
                        <Loader2Icon className=' animate-spin' />
                        Yes, delete
                        </> : "Yes, delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModelDeleteAccount