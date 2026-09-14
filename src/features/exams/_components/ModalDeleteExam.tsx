"use client"
import { Button } from '@/src/shared/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/shared/components/ui/dialog'
import { Loader2Icon, TriangleAlertIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteExam } from '../hooks/hooks'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ModelDeleteExam = ({ id }: { id: string }) => {
    const { mutate, isPending } = useDeleteExam()

    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handelRemoveAccount = () => {
        mutate(id, {
            onSuccess: (data) => {
                toast.success(data.message || "Exam deleted successfully")
                setIsOpen(false)
                router.push(`/`)
            },
            onError: (error) => {
                toast.error(error.message || "Failed to delete Exam")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"destructive"} className="gap-2.5">
                    <Trash2 />
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
                <DialogHeader className="items-center text-center">
                    <div className="mb-2 grid size-16 place-items-center rounded-2xl bg-destructive/10">
                        <TriangleAlertIcon className="size-8 text-destructive" />
                    </div>
                    <DialogTitle>Delete exam?</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete this exam? Any questions
                        attached to it will also be removed. This action is
                        permanent and cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex !justify-center gap-3">
                    <DialogClose asChild>
                        <Button className="flex-1" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handelRemoveAccount}
                        disabled={isPending}
                        className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                        type="submit"
                    >
                        {isPending ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                                Deleting...
                            </>
                        ) : "Yes, delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModelDeleteExam