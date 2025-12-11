const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// A/B 테스트 헤드라인 정의
const headlines = {
  control: {
    variant: ' ',
    headline: '아직도 스크린샷만 찍고 잊어버리시나요?',
    description: '나와의 채팅방에 쌓여만 가는 정보들, Fast Memo로 1초 만에 정리해 보세요.'
  },
  variantA: {
    variant: '  ',
    headline: '매일 30분씩 메모 찾는 시간, 이제 그만 낭비하세요',
    description: '시간은 금입니다. Fast Memo로 찾는 시간을 0초로 만들어 보세요.'
  },
  variantB: {
    variant: '   ',
    headline: '1초 만에 저장, 1초 만에 찾기. 이게 진짜 메모입니다',
    description: '더 이상 카톡을 메모장처럼 쓰지 마세요. Fast Memo가 진짜 메모 경험을 제공합니다.'
  },
  variantC: {
    variant: '    ',
    headline: '10만 명이 카톡 대신 선택한 메모 습관',
    description: 'Fast Memo로 당신도 스마트한 메모 습관을 시작해 보세요.'
  }
};

// 테스트 데이터 저장 함수
function saveTestData(sessionId, variant, action) {
  const dataFile = path.join(__dirname, 'data', 'test-results.jsonl');
  const timestamp = new Date().toISOString();
  const record = {
    sessionId,
    variant,
    action,
    timestamp
  };
  
  fs.appendFileSync(dataFile, JSON.stringify(record) + '\n');
}

// 초기 데이터 파일 생성
if (!fs.existsSync(path.join(__dirname, 'data', 'test-results.jsonl'))) {
  fs.writeFileSync(path.join(__dirname, 'data', 'test-results.jsonl'), '');
}

// 메인 랜딩 페이지
app.get('/', (req, res) => {
  // 세션 ID 생성 또는 기존 세션 ID 사용
  let sessionId = req.query.sid || uuidv4();
  
  // 헤드라인 선택 (무작위)
  const variantKeys = Object.keys(headlines);
  const selectedVariant = variantKeys[Math.floor(Math.random() * variantKeys.length)];
  const selectedHeadline = headlines[selectedVariant];
  
  // 테스트 데이터 기록 (페이지 뷰)
  saveTestData(sessionId, selectedVariant, 'page_view');
  
  // EJS 템플릿에 데이터 전달
  res.render('index', {
    sessionId,
    variant: selectedVariant,
    variantName: selectedHeadline.variant,
    headline: selectedHeadline.headline,
    description: selectedHeadline.description
  });
});

// CTA 버튼 클릭 추적
app.get('/api/track-click', (req, res) => {
  const { sessionId, variant } = req.query;
  
  if (sessionId && variant) {
    saveTestData(sessionId, variant, 'cta_click');
    res.json({ success: true, message: 'Click tracked' });
  } else {
    res.status(400).json({ success: false, message: 'Missing parameters' });
  }
});

// 스크롤 깊이 추적
app.get('/api/track-scroll', (req, res) => {
  const { sessionId, variant, depth } = req.query;
  
  if (sessionId && variant && depth) {
    saveTestData(sessionId, variant, `scroll_${depth}`);
    res.json({ success: true, message: 'Scroll tracked' });
  } else {
    res.status(400).json({ success: false, message: 'Missing parameters' });
  }
});

// A/B 테스트 결과 대시보드
app.get('/dashboard', (req, res) => {
  const dataFile = path.join(__dirname, 'data', 'test-results.jsonl');
  
  if (!fs.existsSync(dataFile)) {
    return res.render('dashboard', { stats: {} });
  }
  
  const lines = fs.readFileSync(dataFile, 'utf-8').trim().split('\n').filter(line => line);
  const data = lines.map(line => JSON.parse(line));
  
  // 통계 계산
  const stats = {
    totalPageViews: 0,
    totalClicks: 0,
    variants: {}
  };
  
  // 각 variant별 통계 초기화
  Object.keys(headlines).forEach(key => {
    stats.variants[key] = {
      name: headlines[key].variant,
      pageViews: 0,
      clicks: 0,
      ctr: 0,
      scrollDepths: {}
    };
  });
  
  // 데이터 집계
  data.forEach(record => {
    const variant = record.variant;
    if (!stats.variants[variant]) {
      stats.variants[variant] = {
        name: headlines[variant]?.variant || variant,
        pageViews: 0,
        clicks: 0,
        ctr: 0,
        scrollDepths: {}
      };
    }
    
    if (record.action === 'page_view') {
      stats.variants[variant].pageViews++;
      stats.totalPageViews++;
    } else if (record.action === 'cta_click') {
      stats.variants[variant].clicks++;
      stats.totalClicks++;
    } else if (record.action.startsWith('scroll_')) {
      const depth = record.action.replace('scroll_', '');
      stats.variants[variant].scrollDepths[depth] = (stats.variants[variant].scrollDepths[depth] || 0) + 1;
    }
  });
  
  // CTR 계산
  Object.keys(stats.variants).forEach(key => {
    const variant = stats.variants[key];
    if (variant.pageViews > 0) {
      variant.ctr = ((variant.clicks / variant.pageViews) * 100).toFixed(2);
    }
  });
  
  res.render('dashboard', { stats, headlines });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Fast Memo A/B Test Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard`);
});
