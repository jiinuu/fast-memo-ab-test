# Fast Memo A/B 테스트 랜딩 페이지

카카오톡 '나와의 채팅' 사용자를 위한 크롬 확장 프로그램 **Fast Memo**의 A/B 테스트 가능 랜딩 페이지입니다.

## 프로젝트 개요

이 프로젝트는 4가지 다른 헤드라인 버전을 무작위로 제공하여 CTA(Call-to-Action) 클릭률을 측정하는 A/B 테스트 환경을 제공합니다.

### 테스트 대상 헤드라인

| Variant | 헤드라인 | 전략 |
|---------|---------|------|
| **Control** | 아직도 스크린샷만 찍고 잊어버리시나요? | 질문형 공감 유도 |
| **A** | 매일 30분씩 메모 찾는 시간, 이제 그만 낭비하세요 | 손실 회피 (Loss Aversion) |
| **B** | 1초 만에 저장, 1초 만에 찾기. 이게 진짜 메모입니다 | 즉각적 보상 (Instant Gratification) |
| **C** | 10만 명이 카톡 대신 선택한 메모 습관 | 사회적 증거 (Social Proof) |

## 기능

### 1. 동적 헤드라인 제공
- 각 방문자마다 무작위로 4가지 헤드라인 중 하나 제공
- 우측 상단에 현재 테스트 버전 표시
- 세션 ID로 방문자 추적

### 2. 인터랙티브 애니메이션
- **GSAP 스크롤 애니메이션**: 떠다니는 아이콘, 진공청소기 효과
- **3D Hover 효과**: 벤토 그리드 카드에 마우스 올릴 때
- **타이핑 효과**: AI 요약 기능 시연

### 3. 데이터 추적
- **페이지 뷰**: 각 헤드라인 노출 횟수
- **CTA 클릭**: 버튼 클릭 횟수
- **스크롤 깊이**: 25%, 50%, 75%, 100% 지점 추적

### 4. 실시간 대시보드
- 각 Variant별 CTR(Click-Through Rate) 계산
- 스크롤 깊이 분석
- 자동 새로고침 (30초마다)
- 최고 성과 Variant 하이라이트

## 기술 스택

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Templating**: EJS
- **Animation**: GSAP 3.12.2 + ScrollTrigger
- **Data Storage**: JSONL (파일 기반)
- **Analytics**: Chart.js

## 설치 및 실행

### 로컬 환경

```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/fast-memo-ab-test.git
cd fast-memo-ab-test

# 의존성 설치
npm install

# 서버 실행
npm start
```

서버가 `http://localhost:3000`에서 시작됩니다.

### 접근

- **랜딩 페이지**: http://localhost:3000
- **대시보드**: http://localhost:3000/dashboard

## 배포

### Render.com (권장)

1. GitHub에 코드 푸시
2. https://render.com에서 계정 생성
3. 새 웹 서비스 생성
4. GitHub 저장소 연결
5. 자동 배포 완료

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md) 참고

## API 엔드포인트

### GET /
메인 랜딩 페이지를 제공합니다.

**파라미터**:
- `sid` (선택): 세션 ID (미제공 시 자동 생성)

**응답**: EJS 템플릿으로 렌더링된 HTML

### GET /api/track-click
CTA 버튼 클릭을 기록합니다.

**파라미터**:
- `sessionId` (필수): 세션 ID
- `variant` (필수): Variant 이름 (control, variantA, variantB, variantC)

**응답**:
```json
{ "success": true, "message": "Click tracked" }
```

### GET /api/track-scroll
스크롤 깊이를 기록합니다.

**파라미터**:
- `sessionId` (필수): 세션 ID
- `variant` (필수): Variant 이름
- `depth` (필수): 스크롤 깊이 (25, 50, 75, 100)

**응답**:
```json
{ "success": true, "message": "Scroll tracked" }
```

### GET /dashboard
A/B 테스트 결과 대시보드를 제공합니다.

**응답**: EJS 템플릿으로 렌더링된 대시보드 HTML

## 데이터 구조

### test-results.jsonl
각 라인이 하나의 JSON 객체인 JSONL 형식:

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "variant": "variantA",
  "action": "page_view",
  "timestamp": "2025-12-10T05:30:00.000Z"
}
```

**action 값**:
- `page_view`: 페이지 방문
- `cta_click`: CTA 버튼 클릭
- `scroll_25`, `scroll_50`, `scroll_75`, `scroll_100`: 스크롤 깊이

## 대시보드 메트릭

### CTR (Click-Through Rate)
```
CTR = (CTA 클릭 수 / 페이지 뷰 수) × 100%
```

### 스크롤 깊이
각 Variant별로 방문자가 도달한 최대 스크롤 깊이를 추적합니다.

## A/B 테스트 해석

### 통계적 유의성
최소 250명 이상의 방문자 데이터가 필요합니다.

### 신뢰도
95% 신뢰도 기준으로 약 2주 테스트 권장

### 최적화 팁
1. 테스트 기간 중 다른 변수 변경 금지
2. 트래픽이 균등하게 분배되는지 확인
3. 외부 요인(마케팅 캠페인 등) 고려

## 파일 구조

```
fast-memo-ab-test/
├── server.js                 # Express 서버 메인 파일
├── package.json             # 프로젝트 설정
├── render.yaml              # Render.com 배포 설정
├── DEPLOYMENT.md            # 배포 가이드
├── README.md                # 이 파일
├── views/
│   ├── index.ejs           # 랜딩 페이지 템플릿
│   └── dashboard.ejs       # 대시보드 템플릿
├── data/
│   └── test-results.jsonl  # 테스트 데이터 (자동 생성)
└── public/                 # 정적 파일 (향후 추가)
```

## 성능 최적화

### 프론트엔드
- CDN에서 GSAP 라이브러리 로드
- CSS 애니메이션 활용
- 이미지 최적화 (이모지 사용)

### 백엔드
- 간단한 파일 기반 저장소
- 비동기 I/O 활용
- 환경 변수 기반 설정

## 향후 개선 사항

### 단기 (1주)
- [ ] MongoDB 통합으로 데이터 영구 저장
- [ ] 이메일 알림 기능
- [ ] 더 상세한 분석 차트

### 중기 (1개월)
- [ ] Google Analytics 통합
- [ ] A/A 테스트 검증
- [ ] 다변량 테스트 (Multivariate Testing)

### 장기 (3개월)
- [ ] 머신러닝 기반 최적화
- [ ] 사용자 세그먼트 분석
- [ ] 실시간 알림 시스템

## 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 기여

버그 리포트 및 기능 제안은 GitHub Issues에서 환영합니다.

## 지원

문제가 발생하면:
1. [DEPLOYMENT.md](./DEPLOYMENT.md)의 트러블슈팅 섹션 확인
2. 로그 파일 검토
3. GitHub Issues에 문제 보고

---

**제작**: Manus AI  
**최종 업데이트**: 2025년 12월 10일
