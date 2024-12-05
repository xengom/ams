# AMS

Asset Management System

## 1. BUILD

```bash
docker compose up --build
```

## 2. RUN

```bash
docker compose up -d

# 개발 환경 실행
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 3. STOP

```bash
docker compose down -v
```

## 4. DEPLOY

```bash
# 실행
./deploy.sh

# 새 서버로 전송
scp deploy.tar.gz user@new-server:/path/to/deploy

# 새 서버에서
# 1. 압축 해제
tar -xzf deploy.tar.gz
cd deploy

# 2. DB 컨테이너만 먼저 실행
# docker-compose up -d db

# 3. DB 복원 (컨테이너가 완전히 시작될 때까지 잠시 대기) 필요한경우
# sleep 10
# docker exec -i $(docker-compose ps -q db) psql -U dec stockdb < db_backup.sql

# 4. 나머지 서비스 실행
docker-compose up -d
```
