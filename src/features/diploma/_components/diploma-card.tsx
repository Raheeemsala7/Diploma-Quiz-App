import Image from "next/image"
import Link from "next/link"
import slugify from "slugify"
import { IDiploma } from "../types/diploma"

export default function DiplomaCard({
  diploma,
  index,
}: {
  diploma: IDiploma
  index: number
}) {
  return (
    <Link
      href={`/${diploma.id}/${slugify(diploma.title, { lower: true })}`}
      className="group relative block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
      style={{
        animation: `fadeInUp 0.4s ease ${(index % 6) * 0.06}s both`,
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={diploma.image}
          alt={diploma.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, 250px"
        />

        {/* Ink-to-transparent scrim keeps text readable over any artwork */}
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/95 via-sidebar/35 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-5">
          <h3 className="text-lg leading-tight font-semibold text-sidebar-foreground">
            {diploma.title}
          </h3>
          <p className="line-clamp-2 text-sm text-sidebar-foreground/70">
            {diploma.description}
          </p>
        </div>
      </div>
    </Link>
  )
}