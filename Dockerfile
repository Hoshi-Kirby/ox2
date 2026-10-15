# 開発用: サーバーのコードは docker-compose でマウントする
FROM node:22-slim

WORKDIR /app

# 依存関係はイメージ内にインストール（コードはマウント）
COPY package.json package-lock.json ./
RUN npm ci

# tsx が参照する TypeScript 設定
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./

ENV PORT=8000
EXPOSE 8000

# server/ と src/ が変更されたら自動再起動
CMD ["npx", "tsx", "watch", "server/server.ts"]
