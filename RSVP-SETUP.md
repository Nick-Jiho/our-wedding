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
// 청첩장 RSVP 수신용 Apps Script
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['제출시각', '구분', '성함', '참석인원', '동행인', '식사여부', '연락처']);
    }
    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.side || '',
      p.name || '',
      p.count || '',
      p.companion || '',
      p.meal || '',
      p.tel || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

## 3. 웹앱으로 배포

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

1. 배포된 청첩장에서 RSVP 폼을 작성해 제출
2. Google 시트의 `RSVP` 탭에 행이 추가되면 성공 🎉
3. 참석 인원 합계는 시트에서 `=SUM(D2:D)` 같은 수식으로 집계할 수 있습니다.

## 자주 묻는 질문

- **제출은 됐다는데 시트에 안 쌓여요**
  → 3번에서 "액세스 권한"을 `모든 사용자`로 했는지 확인하세요. 코드를 수정했다면 **새 배포**가 아니라 **배포 관리 → 편집(연필) → 버전: 새 버전**으로 다시 배포해야 반영됩니다.
- **연락처도 받고 싶어요**
  → `config.js`의 `rsvp.askTel` 을 `true` 로 바꾸면 입력란이 생깁니다.
- **개인정보가 외부로 새지 않나요?**
  → 데이터는 본인 구글 계정의 시트에만 저장됩니다. 제3자 서비스를 거치지 않습니다.
