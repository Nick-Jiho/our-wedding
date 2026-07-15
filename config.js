/**
 * Vintage Film Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: true,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "최성준",
    nameEn: "Groom",
    father: "최용수",
    mother: "이순재",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "이지호",
    nameEn: "Bride",
    father: "이재곤",
    mother: "이은주",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-11-21",
    time: "12:00",
    venue: "Maison d'Italie",
//    hall: "그랜드홀 5층",
    address: "경기 성남시 수정구 설개로 39",
    tel: "02-579-61668",
    mapLinks: {
      kakao: "https://kko.to/T8_0ZV5v54",
      naver: "https://naver.me/GEXhvXKp"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "저희 결혼합니다",
    content: "저희의 결혼 소식이 부담스럽지 않게다가가길 바라며, 편한 마음으로 오셔서 축하해주시면면 감사하겠습니다. \n\n 혹여 참석이 어려우시더라도 부담갖지 마시고, \n마음으로 축하해주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n예식 전, 정성껏 준비한\n웰컴 푸드와 드링크를 마련했습니다.\n조금 일찍 오셔서 편안히 즐기시며\n저희의 시작을 함께해 주시면 감사하겠습니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "최성준", bank: "신한은행", number: "110-323-295593" },
      { role: "아버지", name: "최용수", bank: "신한은행", number: "110-209-865160" },
      { role: "어머니", name: "이순재", bank: "신한은행", number: "615-02-118594" }
    ],
    bride: [
      { role: "신부", name: "이지호", bank: "신한은행", number: "110-471-563056" },
      { role: "아버지", name: "이재곤", bank: "신한은행", number: "110-378-764489" },
      { role: "어머니", name: "이은주", bank: "신한은행", number: "59-111-000080" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 (카카오톡/소셜 미리보기) ──
  meta: {
    title: "최성준 ♥ 이지호 결혼합니다",
    description: "2026년 11월 21일, 소중한 분들을 초대합니다.",
    // GitHub Pages 주소 (끝에 / 없이). OG 썸네일 절대경로 생성에 사용됩니다.
    siteUrl: "https://nchoi0617.github.io/my-wedding",
    // 썸네일을 바꿨는데 카톡에 반영이 안 되면 이 숫자를 1 올리고, 카카오 디버거에서 캐시 초기화하세요.
    ogImageVersion: 2
  },

  // ── 참석 의사 (RSVP) ──
  // 동시예식(예식+식사 동시 진행) 안내와 함께 참석 인원을 미리 받습니다.
  rsvp: {
    enabled: true,
    // Google Apps Script 웹앱 URL을 붙여넣으세요. (설정 방법은 RSVP-SETUP.md 참고)
    // 비워두면 폼은 보이지만 제출 시 미설정 안내가 표시됩니다.
    endpoint: "https://script.google.com/macros/s/AKfycby_WnCnKfgfYBr9riIcmOipisLmyX7KROOMJbWCVW8xjchjGs68GzeqXB9k7Mk1sDPd8w/exec",
    title: "참석 의사 전달",
    desc: "예식과 식사가 동시에 진행되어\n귀한 걸음 부족함 없이 모시기 위해\n참석 의사를 미리 전해주시면 감사하겠습니다."
  }
};
