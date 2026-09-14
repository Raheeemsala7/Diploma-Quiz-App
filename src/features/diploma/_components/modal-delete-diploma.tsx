"use client"
import { Button } from '@/src/shared/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/shared/components/ui/dialog'
import { Loader2Icon, Trash2, TriangleAlertIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteDiploma } from '../hooks/hooks'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ModelDeleteDiploma = ({ id }: { id: string }) => {
    const { mutate, isPending } = useDeleteDiploma()

    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()


    const handelRemoveAccount = () => {
        mutate(id, {
            onSuccess: (data) => {
                toast.success(data.message || "Diploma deleted successfully")
                setIsOpen(false)
                router.push(`/`)
            },
            onError: (error) => {
                toast.error(error.message || "Failed to delete Diploma")
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>
                    <Trash2 />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl flex justify-center items-center flex-col">

                <div className="size-27.5 bg-destructive/10 rounded-full flex justify-center items-center">
                    <div className="size-20 bg-destructive/15 rounded-full flex justify-center items-center" >
                        <TriangleAlertIcon className='size-12.5 text-destructive' />
                    </div>
                </div>

                <h6 className='text-destructive text-lg font-medium'>Are you sure you want to delete your Diploma?</h6>
                <p className='text-muted-foreground text-sm'>This action is permanent and cannot be undone.</p>


                <DialogFooter className='w-full flex !justify-center items-center'>
                    <DialogClose className='flex-1' asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handelRemoveAccount} disabled={isPending} className='flex-1 bg-destructive text-white hover:bg-destructive/90' type="submit">
                        {isPending ? <>
                            <Loader2Icon className=' animate-spin' />
                            Deleting...
                        </> : "Yes, delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModelDeleteDiploma