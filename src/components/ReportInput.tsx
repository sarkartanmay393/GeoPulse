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
    <div className="flex items-center justify-center transition">
      <div className="w-fit p-4 flex flex-col border-[1px] border-solid border-gray-100 items-center justify-start rounded-md shadow-md bg-gray-50 transition">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-center transition">
          <Button
            size='sm'
            id="share-button"
            type="button"
            onClick={handleShare}
            disabled={output === null}
            className="w-full sm:w-[120px] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            <Image src="/share.svg" alt="Share" width={10} height={10} className="mr-1" />
            <p>Share</p>
          </Button>
          <Button
            size='sm'
            id="reset-button"
            type="reset"
            className="w-full sm:w-[196px] bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              resetOutput();
              router.push('/');
            }}
          >
            Generate Another Report
          </Button>
        </div>
      </div>
    </div>
  );
}