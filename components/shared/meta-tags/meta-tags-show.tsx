import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CircleFadingPlus, EqualApproximately } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaTagsRows } from './meta-tags-rows';

interface Props {
  title?:         string
  description?:   string
  keywords?:      string
  className?:     string
}

const SEO_LIMITS = {
  title: 70,
  description: 170,
}

export const MetaTagsShow: React.FC<Props> = ({ title, description, keywords, className }) => {
  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            title='Show Meta Tags' 
            className={`cursor-pointer ${!title || !description || !keywords ? 'bg-red-200' : 'bg-green-200'}`}
            size='sm'
            >
            <CircleFadingPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Meta tags:</DialogTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex">
                <span>Title</span>
                <EqualApproximately size={20} className="px-1" />
                <span>70 символів</span>
              </div>
              <div className="flex">
                <span>Description</span>
                <EqualApproximately size={20} className="px-1" />
                <span>160-170 символів</span>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <MetaTagsRows
            label="Title"
            value={title}
            limit={SEO_LIMITS.title}
          />
          <MetaTagsRows
            label="Description"
            value={description}
            limit={SEO_LIMITS.description}
          />
          <MetaTagsRows
            label="Keywords"
            value={keywords}
            limit={999} // keywords не мають строгого ліміту
          />
        </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
