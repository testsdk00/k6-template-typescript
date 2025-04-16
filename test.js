import http from "k6/http";
import { check } from "k6";
import { sleep } from "k6";

export const options = {
  scenarios: {
    contacts: {
      executor: "per-vu-iterations",
      vus: 1, // 단일 가상 사용자
      iterations: 3, // 정확히 3번 실행
      maxDuration: "30s",
    },
  },
};

export default function () {
  const url = "http://127.0.0.1:3000/api/stamp";
  const payload = JSON.stringify({
    phoneNumber: "01077777777",
  });
  // 헤더를 최소화하고 HTTP 버전 설정
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // 요청 보내기
  const response = http.post(url, payload, params);

  // 응답 확인
  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  // API 호출 사이에 2초 간격 추가 (마지막 반복에서는 슬립하지 않음)
  if (__ITER < 2) {
    // k6에서 제공하는 현재 반복 횟수 (0부터 시작)
    console.log(`API 호출 ${__ITER + 1}번 완료, 2초 대기 중...`);
    sleep(2);
  } else {
    console.log(`API 호출 ${__ITER + 1}번 완료 (마지막 호출)`);
  }
}
