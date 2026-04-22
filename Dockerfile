# استفاده از تصویر Alpine برای کاهش حجم
FROM node:20-alpine AS base

# مرحله 1: نصب وابستگی‌ها
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# کپی فایل‌های package برای استفاده از cache
COPY package.json package-lock.json* ./
RUN npm ci

# مرحله 2: Build کردن اپلیکیشن
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# متغیرهای محیطی که در زمان build نیاز است
# این متغیرها از build args می‌آیند
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PROMPT_API_URL
ARG NEXT_PUBLIC_PACKAGE_NAME
ARG NEXT_PUBLIC_PACKAGE_NAME_PAYMENT
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PROMPT_API_URL=$NEXT_PUBLIC_PROMPT_API_URL
ENV NEXT_PUBLIC_PACKAGE_NAME=$NEXT_PUBLIC_PACKAGE_NAME
ENV NEXT_PUBLIC_PACKAGE_NAME_PAYMENT=$NEXT_PUBLIC_PACKAGE_NAME_PAYMENT
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# غیرفعال کردن telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build کردن پروژه
RUN npm run build

# مرحله 3: تصویر نهایی Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ایجاد گروه و کاربر برای امنیت بیشتر
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# کپی فایل‌های استاتیک
COPY --from=builder /app/public ./public

# کپی فایل‌های build شده
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# استفاده از standalone output برای کاهش حجم
CMD ["node", "server.js"]
