const board_url = 'http://127.0.0.1:5000/api/board';

function init(){
  load_board();
  hide_input();
}

init();

////////////////////////조회 /////////////////////////////////
//통신을 통하여 해당 url 정보를 json화 해서 반환 method get
function fetch_tojson(url){
  return fetch(url).then(function(response) {
    if(response.ok){
      return response.json();
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
  });

}

//게시판 글 태그 만들기 
function paint_board(board){
  const board_html =   
  '<section class="board__lists__item" id = "board__'+ board.id + '" onclick = "handle_biginput()">'+
  '<h3>'+board.subject+'</h3>'+ '<hr>'+
  '<p>'+board.content+'</p>' +
  '<ul>'+
  '<li>'+board.create_date+'</li>'+
  '</ul>'+'</section>'; 
  return board_html;
}

// 게시글 조회, 비동기함수 async는 await가 완료될때 까지 대기후 실행
async function load_board(){
    //board_url변수를 통해 json형식의 board정보를 boards변수에 저장
    try{
      const boards = await fetch_tojson(board_url);
      //게시판 tag 생성
      let text ='';
      for (var i = boards.length-1; i >=0; i--) {
        text += paint_board(boards[i]);
      }
      document.querySelector('.Board__lists').innerHTML = text;
    } catch(error){
      console.log(error);
    }

  }

/////////////////////////////입력 /////////////////////////////

function fetch_insert(data){
  return fetch(board_url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then(function(response) {
    if(response.ok){
      return; //response.json();
    }
    else if(response.status === 400){
      alert("제목을 입력해주세요");
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
  });

}
function input_board(){
// 입력후 페인트함수 호출 , 내용 추출객체 반환 
const input_subject = document.querySelector('.input__subject');
const input_content = document.querySelector('.input__article');

let object = {
  subject : input_subject.value,
  content : input_content.value
};
input_subject.value = "";
input_content.value = "";
return object;
}


//입력창 만들기//
function paint_input(){
  const html = '<div class="input__on"><input type="text" placeholder="글 제목을 입력해주세요" class="input__subject">' +
  '<textarea name="article" class="input__article" placeholder="내용을 입력하세요"></textarea>' +
  '<div class = "input__buttons">'+
//file input에 label 붙임 
  '<form method="post" enctype="multipart/form-data"><div class = "file_input">'+
  '<label for="upload_file">'+
    '<img src  = "https://img.icons8.com/small/32/000000/image.png"/></label>'+
  '<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div>'+
  //accept 허용파일 , multilple  다수 파일입력가능 
  '<div class = "file_preview"> </div></form>'+
  '<input type="button"  onclick="handle_input();" value="SUBMIT" />'+
  '<input type="button"  onclick="hide_input();" value="X" /></div>'

  const ele = document.querySelector('.Board__input');
  ele.style.height=400 +'px';
  ele.innerHTML = html;
  handle_upload(); //업로드 리스너
}
//입력창 숨기기//
function hide_input(){
  const html ='<div class = "input__off"><textarea placeholder="게시글을 작성해보세요" onclick="paint_input()"></textarea></div>';
  const ele = document.querySelector('.Board__input');
  ele.style.height=40 +'px';
  ele.innerHTML = html;
}

//버튼 이벤트 헨들러
async function handle_input(){
  try{
    const data = input_board();
    await fetch_insert(data);
    init();
  } catch(error){
    console.log(error);
  }

}

///////////////////////////////보드 확대/////////////////////////////
// 보드 핸들러
function handle_biginput(){
//버튼 이벤트 헨들러Zxc v   
  const event_id = event.currentTarget.id.split('__');
  load_bigboard(event_id[1]);
}

async function load_bigboard(id){
  try{
    const json = await fetch_tojson(board_url +'/'+id);
    paint_bigboard(json);
  } catch(error){
    console.log(error);
  }

}

function paint_bigboard(json){
  const ele =  document.querySelector('.Board');
  ele.innerHTML = '';
  const html = '<div class="Board__title"><h1>모임이름 - 게시판</h1> </div>'+
  '<div class="input__big"> <div class = "board__bigsubject">'+`<h2> ${json.subject}</h2>`+'</div>'+ //templates literal 적용 
  '<div class = "board__bigarticle">'+'<p>'+json.content+'</p>'+'</div>'
  +
  '<div class = "board__bigothers">'+ '<p>'+json.create_date+'</p>'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="handle_delete();" value="삭제" />'+
  '<input type="button"  onclick="reload_board();" value="목록" />'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="handle_modify();" value="수정" />'


  ele.innerHTML = ''; //초기화 다지우기 
  ele.innerHTML = html;
}

////////////////////////보드 삭제////////////////////////
function handle_delete(){
 const confirmflag = confirm("삭제하시겠습니까?");
 if(confirmflag){
  const event_id = event.currentTarget.id.split('__');
  delete_board(event_id[1]);
}
}
async function delete_board(id){
  try{

    const json = await fetch_delete(board_url +'/'+id);
    reload_board();
  } catch(error){
    console.log(error);

  }
}

function fetch_delete(url){
  return fetch(url,{
    method: 'DELETE',
  }).then(function(response) {
    if(response.ok){
      return alert("삭제되었습니다!");
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
  });

}

function reload_board(){
  document.querySelector('.Board').innerHTML = '<div class="Board__title"><h1>모임이름 - 게시판</h1> </div>'+'<div class="Board__input"></div>' +
  '<div class="Board__lists"></div>';
  init();
}

///////////////////////////수정////////////////////////////////
function handle_modify(){
  const event_id = event.currentTarget.id.split('__');
  paint_modify(event_id[1]);
}
function fetch_modify(id , data){
  const url = board_url + '/' + id;
  return fetch(url,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then(function(response) {
    if(response.ok){
      return load_bigboard(id);
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
  });

}

async function paint_modify(id){
  const tag = document.querySelector('.input__big');
  const json = await fetch_tojson(board_url + '/' + id);
  tag.innerHTML = '';
  tag.innerHTML = '<input type="text" value="'+json.subject+'" class="input__bigsubject">'+
  '<textarea name="article" class="input__bigarticle">'+json.content+'"</textarea>'+
  '<div class = "input__bigothers">'+ '<p>'+json.create_date+'</p>'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="handle_delete();" value="삭제" />'+
  '<input type="button"  onclick="reload_board();" value="목록" />'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="modify_board();" value="완료" /></div>';
}

async function modify_board(){
  const event_id = event.currentTarget.id.split('__');
  const input__bigsubject = document.querySelector('.input__bigsubject');
  const input__bigarticle = document.querySelector('.input__bigarticle');
  let data = {
    subject : input__bigsubject.value,
    content : input__bigarticle.value,
    id : event_id[1]
  };
  await fetch_modify(event_id[1] , data);
}

//////////파일업로드///////////
function handle_upload(){

  const input = document.querySelector('.input_file');
  // const preview = document.querySelector('.file_preview');
  // input.addEventListener('change' , upload_files(input,preview));
  input.addEventListener('change' , upload_files);

}

function validFileType(file) {
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon"
  ];
  return fileTypes.includes(file.type);
}

function upload_files(){
    // const file = document.getElementById('upload_file');
    // file.addEventListener('onchange')
    // const files = event.target.files;
    // const fileReader = new FileReader();
    // // fileReader.readAsText(files[0]); //텍스트 파일 읽을때 사용
    // // fileReader.readAsDataURL(files[0]); //이미지를 URL로 읽음 , 미리보기로 사용하기좋다
    // // fileReader.readAsArrayBuffer(files[0]);//버퍼링 , 서버로 보낼때 사용함
    // // fileReader.readAsBinaryString(files[0]);//이진값으로 반환 서버에서 주로사용함 
    // fileReader.onload = function(event){
    //   console.log(event.target.result);
    // }
  const input = document.querySelector('.input_file');
  const preview = document.querySelector('.file_preview');
  preview.style.cssText = " border-style: dashed; border-color: lightgray;";
  const curfiles = input.files; //현재 선택된 파일
  const MAX_FILE = 5;
  if(curfiles.length>MAX_FILE){
    alert(`이미지는 최대 ${MAX_FILE}개 까지 등록가능합니다`);
    return;
  }
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild); //이전의 미리보기 삭제

  }
  if(curfiles.length ===0){ //선택된 파일없을때
    alert('선택된 파일이없습니다.');
  }
  else{ //선택파일이 있을 경우 
    for(const file of curfiles){ //파일 목록 그리기 
      if(validFileType(file)){ //파일 유효성 확인 
        const image = document.createElement('img'); //미리보기 이미지 
        image.src = URL.createObjectURL(file);
        preview.appendChild(image); //이미지태그 그리기 
      }
      else alert('이미지파일만 업로드가능합니다');
    }
  }

}


