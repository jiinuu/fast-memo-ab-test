# Fast Memo A/B 테스트 배포 가이드

## 개요

Fast Memo 랜딩 페이지의 A/B 테스트 서버를 클라우드에 영구적으로 배포하는 방법을 설명합니다.

## 배포 옵션

### 옵션 1: Render.com (권장)

**장점**: 무료 플랜 제공, 자동 배포, SSL 인증서 자동 설정

#### 배포 단계

1. **GitHub에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Fast Memo A/B test server"
   git remote add origin https://github.com/YOUR_USERNAME/fast-memo-ab-test.git
   git push -u origin main
   ```

2. **Render.com 계정 생성**
   - https://render.com 방문
   - GitHub 계정으로 로그인

3. **새 웹 서비스 생성**
   - Dashboard에서 "New +" 클릭
   - "Web Service" 선택
   - GitHub 저장소 선택
   - 다음 설정 입력:
     - **Name**: fast-memo-ab-test
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **배포 완료**
   - Render가 자동으로 배포 시작
   - 약 2-3분 후 배포 완료
   - 제공된 URL (예: https://fast-memo-ab-test.onrender.com)로 접근 가능

### 옵션 2: Railway.app

**장점**: 간단한 배포, GitHub 연동

#### 배포 단계

1. **Railway 계정 생성**
   - https://railway.app 방문
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 저장소 선택

3. **환경 변수 설정**
   - Variables 탭에서 `NODE_ENV=production` 추가

4. **배포 완료**
   - Railway가 자동으로 배포
   - 제공된 도메인으로 접근 가능

### 옵션 3: Vercel (Node.js 지원)

**장점**: 빠른 배포, 우수한 성능

#### 배포 단계

1. **Vercel 계정 생성**
   - https://vercel.com 방문
   - GitHub 계정으로 로그인

2. **프로젝트 임포트**
   - "New Project" 클릭
   - GitHub 저장소 선택

3. **배포 완료**
   - Vercel이 자동으로 배포

## 배포 후 확인

### 랜딩 페이지 접근
```
https://your-domain.com
```

### A/B 테스트 대시보드 접근
```
https://your-domain.com/dashboard
```

## 데이터 지속성

현재 설정에서는 테스트 데이터가 `data/test-results.jsonl` 파일에 저장됩니다. 무료 플랜의 경우 서버 재시작 시 데이터가 초기화될 수 있습니다.

### 영구 데이터 저장을 위한 개선 사항

데이터를 영구적으로 보존하려면 다음 옵션을 고려하세요:

1. **MongoDB Atlas (무료)**
   - 클라우드 기반 데이터베이스
   - 무료 플랜: 512MB 저장소
   - 설정: https://www.mongodb.com/cloud/atlas

2. **PostgreSQL (무료)**
   - Render.com의 무료 PostgreSQL 제공
   - 배포 시 함께 설정 가능

3. **Firebase Realtime Database (무료)**
   - Google의 실시간 데이터베이스
   - 무료 플랜: 100MB 저장소

## 커스텀 도메인 설정

### Render.com에서 커스텀 도메인 설정

1. 웹 서비스 설정으로 이동
2. "Custom Domain" 섹션에서 도메인 추가
3. DNS 설정 지시사항 따라 도메인 DNS 레코드 수정
4. 약 24시간 후 적용 완료

### 도메인 구매
- GoDaddy, Namecheap, Route53 등에서 도메인 구매 가능
- 연 $10-15 정도의 비용

## 모니터링 및 로그

### Render.com 로그 확인
- Dashboard에서 웹 서비스 선택
- "Logs" 탭에서 실시간 로그 확인

### 성능 모니터링
- 대시보드에서 CPU, 메모리, 네트워크 사용량 확인

## 비용

### 무료 플랜
- **Render.com**: 무료 (월 750시간 제한)
- **Railway.app**: 무료 (월 $5 크레딧)
- **Vercel**: 무료

### 유료 플랜 (선택사항)
- **Render.com Pro**: 월 $7부터
- **Railway.app Pro**: 월 $5부터

## 트러블슈팅

### 배포 실패
1. 로그 확인: "Logs" 탭에서 에러 메시지 확인
2. package.json 검증: `npm install` 실행 가능한지 확인
3. Node 버전 확인: package.json에 `engines` 필드 확인

### 데이터 손실
- 무료 플랜의 경우 서버 재시작 시 메모리 기반 데이터 손실
- 데이터베이스 통합 권장

### 느린 성능
- 무료 플랜은 비활성 15분 후 자동 절전
- 첫 요청 시 깨어나는 데 30초 소요
- 유료 플랜으로 업그레이드 권장

## 다음 단계

1. **데이터베이스 통합**: MongoDB 또는 PostgreSQL 추가
2. **이메일 알림**: 테스트 결과를 이메일로 받기
3. **고급 분석**: Google Analytics 통합
4. **커스텀 도메인**: 브랜드 도메인 설정

## 지원

배포 중 문제가 발생하면:
1. Render/Railway 문서 확인
2. 커뮤니티 포럼 검색
3. 기술 지원팀에 문의
