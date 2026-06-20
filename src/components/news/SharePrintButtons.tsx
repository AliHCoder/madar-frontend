"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Printer,
  Twitter,
  Send,
  Link as LinkIcon,
  Check,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  title: string;
  url: string;
}

export default function SharePrintButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState(url);

  useEffect(() => {
    setFullUrl(window.location.href);
  }, []);

  const shareLinks = [
    {
      name: "توییتر",
      icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "تلگرام",
      icon: Send,
      color: "bg-[#0088cc] hover:bg-[#0077b3]",
      href: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "واتساپ",
      icon: ExternalLink,
      color: "bg-[#25D366] hover:bg-[#22bd59]",
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + fullUrl)}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("لینک کپی شد");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("خطا در کپی لینک");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
      <span className="text-xs font-bold text-gray-500 ml-2 flex items-center gap-1">
        <Share2 size={14} />
        اشتراک‌گذاری:
      </span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.name}
          className={`w-9 h-9 ${link.color} rounded-xl flex items-center justify-center text-white transition-all hover:scale-110`}
        >
          <link.icon size={15} />
        </a>
      ))}

      <button
        onClick={copyLink}
        title="کپی لینک"
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
          copied
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
        }`}
      >
        {copied ? <Check size={15} /> : <LinkIcon size={15} />}
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={handlePrint}
        title="چاپ"
        className="w-9 h-9 bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-all hover:scale-110"
      >
        <Printer size={15} />
      </button>
    </div>
  );
}
