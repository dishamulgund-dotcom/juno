'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

interface Props {
  productName: string;
  genericName: string;
}

export default function ProductSpecDownloadButton({ productName, genericName }: Props) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
    window.print();
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
      title="Print or save PDF specification datasheet"
    >
      {downloaded ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Generating Datasheet Print View...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-sky-400" />
          <span>Download / Print Spec Sheet</span>
        </>
      )}
    </button>
  );
}
