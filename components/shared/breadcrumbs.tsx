'use client';

import React from "react";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string
  url?: string
}

interface Props {
  items: Array<BreadcrumbItem>
  className?: string
}

export const Breadcrumbs: React.FC<Props> = ({ items, className }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.url ? { "item": `${process.env.NEXT_PUBLIC_SITE_URL}/${item.url}` } : {})
    }))
  };

  return (
    <>
      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem className="text-xs text-neutral-500">
            <Link href="/">Головна</Link>
          </BreadcrumbItem>

          {items.map((item, index) => (
            <React.Fragment key={item.url || item.label}>
              <BreadcrumbSeparator className={'[&>svg]:w-2.5 [&>svg]:h-2.5 text-gray-400'}>
                <span className="block w-5 h-[1px] bg-gray-400"></span>
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-xs text-neutral-500"> 
                {index === items.length - 1 ? (
                  <span className="text-black">{item.label}</span>
                ) : (
                  item.url ? <Link href={`/${item.url}`}>{item.label}</Link> : <span className="text-black">{item.label}</span>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Вставка структурованих даних для SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  )
}
