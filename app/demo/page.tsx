'use client'
import Projects from '@/app/_components/Projects';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import { useAuth } from '@/context/AuthContext';
import { useProcess } from '@/context/ProcessContext';
import { Webdata } from '@/data/data'
import { useEffect, useState } from 'react';


function page() {
  const { selectedProcess } = useProcess();
    const { user } = useAuth();
    const activeData = selectedProcess || Webdata.processes.visionPlus;
    const [questions, setQuestions] = useState<any[]>([]);
  console.log("selected proces",selectedProcess)
    useEffect(() => {
      const fetchQuestions = async () => {
        if (!user || !activeData?.name) return;
        const key = Object.keys(Webdata.processes).find(
          (k) => (Webdata.processes as any)[k].name === activeData.name
        );
        if (!key) return;
        const res = await fetch(`/api/process/${key}?userId=${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      };
      fetchQuestions();
    }, [user, activeData]);
    console.log("demo",activeData.projects)
  return (
  <div className="max-w-7xl mx-auto px-4 py-12">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {activeData.projects?.map((items, index) => (
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

export default page