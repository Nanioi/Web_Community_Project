import * as FETCH from "./fetch.js"

export function attach_event_when_title_click() {

    document.querySelector('.post_title').addEventListener('click', function () {
      if (location.hash.split('#')[1] == 'total') {
        location.href = 'http://127.0.0.1:5000/';
      }
      if (location.hash.split('#')[1] !== null) {
        location.href = 'http://127.0.0.1:5000/post#' + location.hash.split('#')[1] + '#postmain';
      }
    });
  }
  export function attach_event_when_search(search_type, search_range) {
    const input_data = search_type.querySelector('input');
    search_type.querySelector('input').addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        location.href = move_page_when_search(FETCH.save_about_search_data(search_type, input_data), search_range);
      }
    });
    search_type.querySelector('button').addEventListener('click', function () {
      location.href = move_page_when_search(FETCH.save_about_search_data(search_type, input_data), search_range);
    });
    input_data.value = '';
  }
  export function move_page_when_search(data, search_type) {
    if (search_type == 'total') return `#total#search#search_type=${data.searchType}&input_value=${data.text}&page=`;
    else {
      const board_id = location.hash.split('#')[1];
      return `#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=`;
    }
  }