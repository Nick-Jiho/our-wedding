# RSVP 참석 의사 받기 설정 (Google Sheets)

청첩장은 GitHub Pages(정적 사이트)라 자체 서버가 없습니다.
누가 참석하는지 보려면 **Google Sheets + Apps Script**로 응답을 받습니다. 무료이고, 데이터는 본인 구글 계정에만 저장됩니다.

소요 시간 약 5분. 아래 순서대로 따라 하세요.

---

## 1. Google 스프레드시트 만들기

1. https://sheets.google.com 접속 → **빈 스프레드시트** 생성
2. 이름을 `청첩장 참석현황` 등으로 지정 (이름은 자유)

## 2. Apps Script 코드 붙여넣기

1. 시트 상단 메뉴에서 **확장 프로그램 → Apps Script** 클릭
2. 기본으로 열린 `Code.gs` 내용을 모두 지우고, 아래 코드를 붙여넣기
3. 💾 저장 (Ctrl+S)

```javascript
// 청첩장 RSVP 수신용 Apps Script  (버전: v3)
var RSVP_HEADERS = ['제출시각', '구분', '참석여부', '성함', '동행인', '동행인수(본인제외)', '식사여부', '전달사항'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');

    // 헤더가 비었거나 옛 형식이면 항상 새 형식으로 맞춰줌 (한 번 만들어진 헤더도 자동 보정)
    var firstRow = sheet.getRange(1, 1, 1, RSVP_HEADERS.length).getValues()[0];
    if (firstRow.join('') === '' || firstRow[2] !== '참석여부') {
      sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setValues([RSVP_HEADERS]);
    }

    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.side || '',
      p.attend || '',
      p.name || '',
      p.companionName || '',
      p.companionCount || '',
      p.meal || '',
      p.message || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 배포 확인용: 배포된 exec URL을 브라우저에서 열면 이 메시지가 보여야 함.
// "RSVP v3 정상 동작중" 이 안 보이면 새 코드가 아직 배포 안 된 것.
function doGet() {
  return ContentService
    .createTextOutput('RSVP v3 정상 동작중')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## 3. 웹앱으로 배포

### ⓐ 처음 배포하는 경우

1. 우측 상단 **배포 → 새 배포** 클릭
2. 톱니바퀴(⚙️) → **웹 앱** 선택
3. 설정:
   - **설명**: 아무거나 (예: 청첩장 RSVP)
   - **다음 사용자 인증 정보로 실행**: `나(본인 계정)`
   - **액세스 권한이 있는 사용자**: **`모든 사용자`** ← 반드시 이걸로!
4. **배포** 클릭 → 권한 승인 요청이 뜨면 본인 계정으로 허용
   - "Google에서 확인하지 않은 앱" 경고가 나오면 **고급 → (프로젝트명)(으)로 이동 → 허용**
5. 배포 완료 후 표시되는 **웹 앱 URL** 복사
   - 형식: `https://script.google.com/macros/s/AKfy.../exec`

### ⓑ 이미 배포한 적 있어서 "코드만 바꾸는" 경우 ⚠️ 가장 헷갈리는 부분

코드를 수정하고 **저장(Ctrl+S)만 하면 배포에는 반영되지 않습니다.** URL은 그대로 두고 새 버전으로 재배포해야 합니다:

1. 코드 붙여넣고 **저장(Ctrl+S)** — 저장됐는지 꼭 확인
2. 우측 상단 **배포 → 배포 관리** (❌ "새 배포" 아님)
3. 기존 배포 항목의 **연필(편집)** 아이콘 클릭
4. **버전** 드롭다운 → **"새 버전"** 선택  ← 이걸 안 하면 옛 코드가 계속 돕니다
5. **배포** 클릭

> "새 배포"를 누르면 URL이 새로 생겨서 `config.js`도 또 바꿔야 합니다. **반드시 "배포 관리 → 편집 → 새 버전"** 으로 하세요.

## 4. config.js에 URL 붙여넣기

`config.js` 파일의 `rsvp.endpoint` 에 복사한 URL을 붙여넣으세요:

```javascript
  rsvp: {
    enabled: true,
    endpoint: "https://script.google.com/macros/s/AKfy.....여기에/exec",
    ...
  }
```

저장 후 커밋/푸시하면 끝입니다.

---

## 확인 방법

1. **새 코드가 배포됐는지 먼저 확인** — `config.js`의 `endpoint` URL을 그대로 브라우저 주소창에 붙여넣고 열어보세요.
   - **`RSVP v3 정상 동작중`** 이 보이면 → 새 코드 배포 완료 ✅
   - 옛 화면/오류가 보이면 → 아직 옛 코드입니다. 위 **3-ⓑ "배포 관리 → 편집 → 새 버전"** 을 다시 하세요.
2. 배포된 청첩장에서 RSVP 폼을 작성해 제출
3. Google 시트의 `RSVP` 탭에 행이 추가되고, 헤더가 `제출시각·구분·참석여부·성함·동행인·동행인수·식사여부·전달사항` 8칸으로 보이면 성공 🎉
4. 총 참석 인원은 `본인 수 + 동행인 수`로 집계합니다. 빈 셀에 아래 수식을 넣으세요:
   - 총 참석 인원: `=COUNTIF(C2:C,"참석") + SUM(F2:F)`
   - 식사 인원(예정): 식사여부 G열이 "예정"인 행 기준으로 별도 집계

## 자주 묻는 질문

- **코드를 바꿨는데 시트 컬럼/내용이 옛날 그대로예요** (가장 흔함)
  → 코드 저장만으로는 반영 안 됩니다. **3-ⓑ** 처럼 `배포 → 배포 관리 → 편집(연필) → 버전: 새 버전 → 배포`를 하세요. 그 후 1번 방법(`exec` URL을 브라우저로 열기)으로 `v3`이 뜨는지 확인하세요.
- **헤더가 옛날 형식이라 컬럼이 안 맞아요**
  → 새 코드(v3)는 헤더를 자동으로 새 형식에 맞춰줍니다. 기존에 쌓인 테스트 행이 지저분하면 시트에서 그 행들을 지우면 됩니다.
- **제출은 됐다는데 시트에 안 쌓여요**
  → 3번에서 "액세스 권한"을 `모든 사용자`로 했는지 확인하세요.
- **개인정보가 외부로 새지 않나요?**
  → 데이터는 본인 구글 계정의 시트에만 저장됩니다. 제3자 서비스를 거치지 않습니다.
