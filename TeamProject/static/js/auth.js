import * as URL from "./config.js"
import { signup_FetchAPI, get_userinfo_FetchAPI } from './post/fetch.js'

// --------- 접속 시 실행 ------------
before_login();
get_userinfo_FetchAPI();

// -------- 로그인, 회원가입 창 모달 ---------
const login_modal = `
<div class="login_modal_back">
    <div class="login_modal">
        <div class="login_exit">X</div>
        <div class="login_title">
        로그인ㅡ  
        </div>
        <div>
            <input type="text" id="nav_login_id" name="id" class="login_input" placeholder="아이디 입력"
                autocomplete="off">
        </div>
        <div>
            <input type="password" id="login_pw" name="pw" class="login_input" placeholder="비밀번호 입력"
                autocomplete="off">
        </div>
        <div><button id="login_btn" class="login_btn">LOGIN</button></div>
    </div>
</div>`;

const signup_modal = `<div class="signup_modal_back">
<div class="signup_modal">
    <div class="signup_exit">X</div>
    <div class="signup_title">
        회원 가입
    </div>

    <div>
        <span class="signup_sub">* 이름</span>
        <input type="text" id="signup_name" name="name" class="signup_input" placeholder="이름"
            autocomplete="off" required maxlength="20">
    </div>
    <div>
        <span class="signup_sub">* 아이디</span>
        <input type="text" id="signup_id" name="id" class="signup_input" placeholder="아이디"
            autocomplete="off" required maxlength="20">
    </div>
    <div>
        <span class="signup_sub">* 비밀번호 (6~12)</span>
        <input type="password" id="signup_pw" name="pw" class="signup_input" placeholder="6 ~ 12자 / 특수문자 포함"
            autocomplete="off" required maxlength="12">
    </div>
    <div>
        <span class="signup_sub">* 비밀번호 확인</span>
        <input type="password" id="signup_pw2" name="pw" class="signup_input" placeholder="비밀번호 확인"
            autocomplete="off" required maxlength="12">
    </div>
    <div>
        <span class="signup_sub">* 닉네임 (~12)</span>
        <input type="text" id="signup_nickname" name="nickname" class="signup_input" placeholder="닉네임"
            autocomplete="off" required maxlength="12">
    </div>
    <div>
        <span class="signup_sub">* 이메일</span>
        <input type="email" id="signup_email" name="email" class="signup_input" placeholder="aaa@aaa.aaa"
            autocomplete="off" required maxlength="30">
    </div>
    <div>
        <span class="signup_sub">* 생년월일</span>
        <input type="date" id="signup_birth" name="birth" class="signup_input" placeholder="YYYY-MM-DD"
        autocomplete="off" required min="1900-01-01" required>
    </div>
    <div>
        <span class="signup_sub">프로필 사진</span>
        <input type="file" id="signup_image" class="signup_input" accept="image/*">
    </div>
    <div><button id="signup_btn" class="signup_btn">SIGN UP</button></div>

</div>
</div>`;

// --------------- 로그인 하기 전 상태 before_login ----------------
function before_login() {
    const auth_container = document.querySelector(".nav_auth");
    auth_container.innerHTML = `<span id="nav_login" class="nav_login">로그인</span>
    <span id="nav_signup" class="nav_signup">회원가입</span>`;

    if ((window.location.href == URL.MAIN_API) || (window.location.href == URL.MAIN_SUBTITLE)) {
        const main_auth_container = document.querySelector(".sub_container");
        main_auth_container.innerHTML = `<div>
        <input type="text" id="main_login_id" name="id" class="main_login_input" placeholder="아이디 입력"
        autocomplete="off">
        </div>
        <div>
        <input type="password" id="main_login_pw" name="pw" class="main_login_input" placeholder="비밀번호 입력"
        autocomplete="off">
        </div>
        <button id="main_login_btn" class="main_login_btn">로그인</button>`;

        main_login_btn_func(); // 메인로그인함수 호출
    }
    nav_login_btn_func();
    nav_signup_btn_func();
}

// ---------- 로그인 완료한 상태 afet_login -------------
function after_login(res) {
    const auth_container = document.querySelector(".nav_auth");

    while (auth_container.hasChildNodes()) {
        auth_container.removeChild(auth_container.firstChild);
    }

    const user = document.createElement("span");
    user.classList.add("nav_user_info");
    user.innerHTML = `<img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_img"> ` + res['nickname'];
    auth_container.appendChild(user);

    const logout = document.createElement("span");
    logout.innerHTML = "로그아웃"
    logout.classList.add("nav_logout");
    logout.addEventListener("click", function () {
        sessionStorage.removeItem("access_token");
        before_login();
        location.href = "/";
    })
    auth_container.appendChild(logout);

    // 만약 로그인한 유저의 닉네임이 GM이면 관리자 이므로, 마이페이지 대신 관리자페이지를 넣어준다.
    if (res['nickname'] == "GM") {
        const manager_page = document.createElement("span");
        manager_page.innerHTML = "관리자페이지";
        manager_page.classList.add("nav_manager_page");
        manager_page.addEventListener("click", () => {
            location.href = 'manager';
        })
        auth_container.appendChild(manager_page);
    } else {
        const mypage = document.createElement("span");
        mypage.innerHTML = "마이페이지";
        mypage.classList.add("nav_mypage");
        mypage.addEventListener("click", () => {
            location.href = 'mypage';
        })
        auth_container.appendChild(mypage);
    }

    if ((window.location.href == URL.MAIN_API) || (window.location.href == URL.MAIN_SUBTITLE)) {
        const main_auth_container = document.querySelector(".sub_container");
        main_auth_container.innerHTML = `<div class="main_auth_div"><span class="main_user_info">
        <img src="../static/img/profile_img/${res['profile_img']}" class="main_user_image"> ${res['nickname']} 님 환영합니다. </span></div>`;
    }
}

// ---------------- 메인의 로그인 버튼 실행 함수 ----------------
function main_login_btn_func() {

    const main_login_btn = document.querySelector(".main_login_btn");
    const main_login_id = document.querySelector("#main_login_id");
    const main_login_pw = document.querySelector("#main_login_pw");

    main_login_btn.addEventListener("click", () => {
        login_FetchAPI(main_login_id, main_login_pw);
    })

    // enter 키 입력 시 로그인 API 호출
    main_login_pw.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) login_FetchAPI(main_login_id, main_login_pw);
    })
}

// ------------ 네비게이션의 로그인 버튼 실행 함수 ---------------
function nav_login_btn_func() {
    const nav_login_btn = document.querySelector("#nav_login");
    const login_container = document.querySelector("#login_container");

    nav_login_btn.addEventListener("click", () => {
        // 로그인 모달을 만들어준다.
        login_container.innerHTML = login_modal;

        // 로그인 모달 주요 style 변경
        setTimeout(() => {
            document.querySelector(".login_modal").style.opacity = "1";
            document.querySelector(".login_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
        }, 50);

        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".login_exit").addEventListener("click", function () {
            login_container.innerHTML = '';
        })

        const nav_login_id = document.querySelector("#nav_login_id");
        const nav_login_pw = document.querySelector("#nav_login_pw");

        // Login 버튼 클릭시 로그인 API 호출
        document.querySelector("#login_btn").addEventListener("click", function () {
            login_FetchAPI(nav_login_id, nav_login_pw);
        })
        // enter 키 입력 시 로그인 API 호출
        document.querySelector("#login_pw").addEventListener("keyup", (e) => {
            if (e.keyCode === 13) login_FetchAPI(nav_login_id, nav_login_pw);
        })

    })
}
//nav바 클릭시 

// ------------------------ 로그인 Fetch API ----------------------------
function login_FetchAPI(id, pw) {

    const send_data = {
        'userid': id.value,
        'password': pw.value
    };

    const login_url = URL.AUTH_API + "/login";
    fetch(login_url, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(send_data)
    })
        .then(res => res.json())
        .then((res) => {
            if (res['result'] == "success") {
                sessionStorage.setItem('access_token', "Bearer " + res['access_token']);
                document.querySelector("#login_container").innerHTML = '';
                get_userinfo_FetchAPI();
            } else if (res['error'] == "패스워드가 다릅니다.") {
                alert("비밀번호를 다시 확인해주세요.");
                pw.focus();
            } else if (res['error'] == "당신은 회원이 아니십니다.") {
                alert("아이디를 다시 확인해주세요.");
                id.focus();
            }
        })
}

// ---------------- 네비게이션의 회원가입 버튼 실행 함수 -----------------
function nav_signup_btn_func() {
    const nav_signup_btn = document.querySelector("#nav_signup");
    const signup_container = document.querySelector("#signup_container");


    nav_signup_btn.addEventListener("click", function () {
        // 회원가입 모달을 만들어줌
        signup_container.innerHTML = signup_modal;

        // 회원가입 모달 주요 style 변경
        setTimeout(() => {
            document.querySelector(".signup_modal").style.opacity = "1";
            document.querySelector(".signup_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
        }, 50);

        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".signup_exit").addEventListener("click", function () {
            signup_container.innerHTML = '';
        })

        // signup 버튼 클릭시 회원가입 api 호출
        document.querySelector("#signup_btn").addEventListener("click", function () {
            const name = document.querySelector("#signup_name");
            const id = document.querySelector("#signup_id");
            const pw = document.querySelector("#signup_pw");
            const pw2 = document.querySelector("#signup_pw2");
            const email = document.querySelector("#signup_email");
            const nick = document.querySelector("#signup_nickname");
            const birth = document.querySelector("#signup_birth");
            if (signup_input_check(name, id, pw, pw2, email, nick, birth)) signup_FetchAPI(name, id, pw, pw2, email, nick, birth);
        })
        // enter 키 입력 시 로그인 API 호출
        document.querySelector("#signup_birth").addEventListener("keyup", (e) => {
            if (e.keyCode === 13) {
                if (signup_input_check()) signup_FetchAPI();
            }
        })
    })
}

// ---------------------- Signup 입력값 판별 함수 -------------------
function signup_input_check(name, id, pw, pw2, email, nick, birth) {

    if (name.value == "") {
        alert("이름을 입력해주세요.");
        name.focus();
        return false;
    } else if (id.value == "") {
        alert("아이디를 입력해주세요.");
        id.focus();
        return false;
    } else if (pw.value == "") {
        alert("비밀번호를 입력해주세요.");
        pw.focus();
        return false;
    } else if (pw2.value == "") {
        alert("비밀번호 확인란을 입력해주세요.");
        pw2.focus();
        return false;
    } else if (pw.value != pw2.value) {
        alert("비밀번호 확인란을 확인해주세요.")
        pw2.focus();
        return false;
    } else if (nick.value == "") {
        alert("닉네임을 입력해주세요.");
        nick.focus();
        return false;
    } else if (email.value == "") {
        alert("이메일을 입력해주세요.");
        email.focus();
        return false;
    } else if (birth.value == "") {
        alert("생년월일을 입력해주세요.");
        birth.focus();
        return false;
    }
    // 조건 다 통과하면 true 반환
    return true;
}

export {after_login};