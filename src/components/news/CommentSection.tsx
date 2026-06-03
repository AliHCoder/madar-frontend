"use client";

import { useState, useEffect } from "react";
import { commentApi, Comment } from "@/lib/api";
import { MessageSquare, Send, User, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  articleId: string;
}

export default function CommentSection({ articleId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    commentApi
      .getByArticle(articleId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      await commentApi.create(articleId, name.trim(), body.trim());
      toast.success("دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.");
      setName("");
      setBody("");
    } catch {
      toast.error("خطا در ثبت دیدگاه");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageSquare size={20} className="text-red-500" />
        دیدگاه‌ها
        {comments.length > 0 && (
          <span className="text-sm font-normal text-gray-500">
            ({comments.length})
          </span>
        )}
      </h3>

      {/* فرم ثبت دیدگاه */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام شما *"
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
          />
        </div>
        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="متن دیدگاه شما *"
            required
            rows={4}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-500 transition-all disabled:opacity-50 shadow-lg shadow-red-500/25 text-sm"
        >
          <Send size={16} />
          {submitting ? "در حال ارسال..." : "ارسال دیدگاه"}
        </button>
      </form>

      {/* لیست دیدگاه‌ها */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">هنوز دیدگاهی ثبت نشده است</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id || comment._id}
              className="border border-gray-100 dark:border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <User size={14} className="text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {comment.name}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1 mr-auto">
                  <Clock size={12} />
                  {new Date(comment.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
