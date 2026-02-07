'use client'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';

interface DemoClientProps {
  projects: any[];
}

export default function DemoClient({ projects }: DemoClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((items, index) => (
          <DirectionAwareHover
            key={index}
            imageUrl={items.bgImage || ''}
            className="w-full h-[260px] rounded-2xl overflow-hidden shadow-md"
          >
            <div className="p-4">
              <h2 className="text-lg font-bold text-white">{items.title}</h2>
              <p className="text-sm text-white/80">{items.description}</p>
            </div>
          </DirectionAwareHover>
        ))}
      </div>
    </div>
  );
}
