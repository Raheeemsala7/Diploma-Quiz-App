import ModelDeleteDiploma from '@/src/features/diploma/_components/modal-delete-diploma';
import { getDiplomaApi } from '@/src/features/diploma/apis/diploma.api';
import { Button, buttonVariants } from '@/src/shared/components/ui/button';
import { cn } from '@/src/shared/lib/utils';
import { Ban, PenLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify'

interface IProps {
  params: Promise<{
    id: string;
    title: string;
  }>
}

const page = async ({ params }: IProps) => {

  const { id, title } = await params

  const data = await getDiplomaApi(id)

  if (!data.status) {
    return <p>Error</p>
  }

  const diploma = data.payload.diploma

  return (
    <div className="space-y-4">
      <div className='flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between'>
        <h5 className="text-lg font-semibold tracking-tight text-foreground">
          {title.split("-").join(" ")}
        </h5>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2.5">
            <Ban />
            Immutable
          </Button>
          <Link className={cn(buttonVariants(), "gap-2.5")} href={`/${diploma.id}/${slugify(diploma.title, { lower: false })}/edit`}>
            <PenLine />
            Edit
          </Link>
          <ModelDeleteDiploma id={id} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="grid gap-6 p-5 md:grid-cols-[220px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <Image src={diploma.image} className='object-cover' fill alt={diploma.title} />
          </div>

          <div className="space-y-4">
            <div>
              <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Title</p>
              <h6 className='font-medium text-foreground'>{diploma.title}</h6>
            </div>
            <div>
              <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Description</p>
              <p className='text-sm leading-relaxed text-muted-foreground'>{diploma.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page