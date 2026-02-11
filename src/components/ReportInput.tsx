'use client';

import { Button } from "../components/ui/button";
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import { toast } from "./ui/use-toast";
import { useStore } from "~/store/useStore";

export default function ReportInput() {
  const router = useRouter();
  const params = useParams();
  const reportId = (params?.reportId as string ?? '');
  const { output, resetOutput } = useStore();

  const handleShare = () => {
    navigator.clipboard.writeText(`https://geo-pulse.vercel.app/report/${reportId}`);
    toast({
      title: "Copied to clipboard!",
      description: "Share the link with your friends to share the report.",
      duration: 2000,
    });
  }

  return (
    <div className="flex items-center justify-center transition animation-slide-up">
      <div className="w-full max-w-2xl p-5 sm:p-6 flex flex-col border-2 border-gray-200 items-center justify-start rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50/50 transition hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full transition">
          <Button
            size='lg'
            id="share-button"
            type="button"
            onClick={handleShare}
            disabled={output === null}
            className="w-full sm:w-auto sm:min-w-[160px] bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image src="/share.svg" alt="Share" width={16} height={16} className="mr-2" />
            <p>Share Report</p>
          </Button>
          <Button
            size='lg'
            id="reset-button"
            type="reset"
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[200px] border-2 font-medium py-3 rounded-xl transition-all hover:bg-gray-100 active:scale-95"
            onClick={() => {
              resetOutput();
              router.push('/');
            }}
          >
            ✨ Generate Another Report
          </Button>
        </div>
      </div>
    </div>
  );
}